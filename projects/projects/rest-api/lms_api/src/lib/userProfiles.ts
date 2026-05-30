import { getDatabaseClient } from "./database";
import { loadConfig } from "../config";
import {
  UserProfileDtoSchema,
  UserProfileExportRowSchema,
  normalizeProfileRole,
} from "../dtos";

type DatabaseRow = Record<string, unknown>;

const database = getDatabaseClient();

const privilegedProfileRoles = [
  "super_admin",
  "admin",
  "instructor",
  "moderador",
];

function parseProfile(row: DatabaseRow) {
  return UserProfileDtoSchema.parse({
    ...row,
    role: normalizeProfileRole(row.role),
  });
}

function parseExportRow(row: DatabaseRow) {
  return UserProfileExportRowSchema.parse({
    ...row,
    role: normalizeProfileRole(row.role),
  });
}

function buildDisplayName(
  email: string,
  fallbackDisplayName?: string | null,
): string {
  if (fallbackDisplayName && fallbackDisplayName.trim().length > 0) {
    return fallbackDisplayName.trim();
  }

  const localPart = email.split("@")[0] ?? "usuario";
  const readable = localPart.replace(/[._-]+/g, " ").trim();

  return readable.length > 0 ? readable : "usuario";
}

function normalizeBootstrapRole(role: string | null | undefined): string {
  if (role && privilegedProfileRoles.includes(role)) {
    return role;
  }

  return "alumno";
}

export async function bootstrapUserProfile(input: {
  userId: string;
  email: string;
  displayName?: string | null;
  avatarUrl?: string | null;
  bio?: string | null;
}) {
  const rows = await database`
    insert into cursos.profiles (
      id,
      display_name,
      email,
      role,
      avatar_url,
      bio
    ) values (
      ${input.userId},
      ${buildDisplayName(input.email, input.displayName)},
      ${input.email},
      'alumno',
      ${input.avatarUrl ?? null},
      ${input.bio ?? null}
    )
    on conflict (id) do update set
      display_name = excluded.display_name,
      email = excluded.email,
      avatar_url = coalesce(excluded.avatar_url, cursos.profiles.avatar_url),
      bio = coalesce(excluded.bio, cursos.profiles.bio),
      role = case
        when cursos.profiles.role in ('super_admin', 'admin', 'instructor', 'moderador')
          then cursos.profiles.role
        else 'alumno'
      end
    returning
      id,
      display_name,
      email,
        avatar_url,
        bio,
      role,
      to_char(created_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as created_at
  `;

  return parseProfile(rows[0] as DatabaseRow);
}

export async function getUserProfileById(userId: string) {
  const rows = await database`
    select
      id,
      display_name,
      email,
      avatar_url,
      bio,
      role,
      to_char(created_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as created_at
    from cursos.profiles
    where id = ${userId}
    limit 1
  `;

  if (rows.length === 0) {
    return null;
  }

  return parseProfile(rows[0] as DatabaseRow);
}

export async function listUserProfiles(input?: { role?: string }) {
  // Use SECURITY DEFINER RPC to list profiles so that RLS and permission
  // boundaries are respected even when the API is invoked by 'authenticated'.
  const rows = await database`
    select
      id,
      display_name,
      email,
      avatar_url,
      bio,
      role,
      to_char(created_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as created_at
    from cursos.list_user_profiles(${input?.role ?? null})
  `;

  return rows.map((row: DatabaseRow) => parseProfile(row));
}

export async function listUserProfileEmails(input?: { role?: string }) {
  const rows = await database`
    select id, display_name, email, role
    from cursos.list_user_profile_emails(${input?.role ?? null})
  `;

  return rows.map((row: DatabaseRow) => parseExportRow(row));
}

// T907: Call Supabase Admin API to update auth.users.email.
// The AFTER UPDATE trigger on auth.users then syncs email to cursos.profiles atomically.
// If this call fails no table is modified; if the DB trigger fails the auth.users
// UPDATE rolls back automatically.
async function updateAuthUserEmail(
  userId: string,
  email: string,
): Promise<void> {
  const config = loadConfig();
  const response = await fetch(
    `${config.SUPABASE_URL}/auth/v1/admin/users/${userId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.SUPABASE_SERVICE_ROLE_KEY}`,
        apikey: config.SUPABASE_SERVICE_ROLE_KEY,
      },
      body: JSON.stringify({ email }),
    },
  );

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as {
      message?: string;
    };
    const message = body.message ?? "Error actualizando correo en auth.users";
    throw Object.assign(new Error(message), {
      code: "EMAIL_UPDATE_FAILED",
      status: response.status,
    });
  }
}

export async function updateUserProfile(
  userId: string,
  input: {
    displayName?: string;
    email?: string;
    avatarUrl?: string | null;
    bio?: string | null;
  },
) {
  // T907: email is no longer written directly to cursos.profiles.
  // The Admin API call updates auth.users, and the AFTER UPDATE trigger
  // propagates email to cursos.profiles within the same DB transaction.
  if (input.email !== undefined) {
    await updateAuthUserEmail(userId, input.email);
  }

  const rows = await database`
    update cursos.profiles
    set
      display_name = coalesce(${input.displayName ?? null}, display_name),
      avatar_url = case
        when ${input.avatarUrl === undefined}
          then avatar_url
        else ${input.avatarUrl ?? null}
      end,
      bio = case
        when ${input.bio === undefined}
          then bio
        else ${input.bio ?? null}
      end
    where id = ${userId}
    returning
      id,
      display_name,
      email,
      avatar_url,
      bio,
      role,
      to_char(created_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as created_at
  `;

  return rows.length === 0 ? null : parseProfile(rows[0] as DatabaseRow);
}

export async function provisionUserRole(input: {
  actorUserId: string;
  userId: string;
  email: string;
  displayName?: string | null;
  role: "moderador" | "instructor";
}) {
  const result = await database.begin(async (tx) => {
    await tx`
      select set_config('request.jwt.claim.sub', ${input.actorUserId}, true)
    `;

    await tx`
      insert into cursos.profiles (
        id,
        display_name,
        email,
        role
      ) values (
        ${input.userId},
        ${buildDisplayName(input.email, input.displayName)},
        ${input.email},
        'alumno'
      )
      on conflict (id) do update set
        display_name = excluded.display_name,
        email = excluded.email,
        role = case
          when cursos.profiles.role in ('super_admin', 'admin', 'instructor', 'moderador')
            then cursos.profiles.role
          else 'alumno'
        end
      returning
        id,
        display_name,
        email,
        role,
        to_char(created_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as created_at
    `;

    await tx`select cursos.set_user_role(${input.userId}, ${input.role})`;

    const profileRows = await tx`
      select
        id,
        display_name,
        email,
        avatar_url,
        bio,
        role,
        to_char(created_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as created_at
      from cursos.profiles
      where id = ${input.userId}
      limit 1
    `;

    const auditPayload = {
      action: "assign_role",
      target_user_id: input.userId,
      target_email: input.email,
      target_display_name: buildDisplayName(input.email, input.displayName),
      role: input.role,
    };

    const eventRows = await tx`
      insert into cursos.domain_events (
        event_type,
        aggregate_type,
        aggregate_id,
        actor_user_id,
        payload
      ) values (
        'moderation.action',
        'profile',
        ${input.userId},
        ${input.actorUserId},
        ${JSON.stringify(auditPayload)}
      )
      returning
        id,
        event_type,
        aggregate_type,
        aggregate_id,
        actor_user_id,
        payload,
        to_char(created_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as created_at
    `;

    return {
      profile: parseProfile(profileRows[0] as DatabaseRow),
      event: eventRows[0] as DatabaseRow,
    };
  });

  return {
    profile: result.profile,
    event: result.event,
  };
}

export function resolveProfileRoleDisplay(
  role: string | null | undefined,
): string {
  return normalizeBootstrapRole(role);
}
