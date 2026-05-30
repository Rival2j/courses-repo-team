import { z } from "zod";
import {
  isoDateTimeSchema,
  nonEmptyTextSchema,
  uuidSchema,
  withObjectKeyAliases,
} from "./common";

export const profileRoleValues = [
  "super_admin",
  "admin",
  "instructor",
  "moderador",
  "alumno",
] as const;

export const ProfileRoleSchema = z.enum(profileRoleValues);
export type ProfileRole = z.infer<typeof ProfileRoleSchema>;

export function normalizeProfileRole(value: unknown): ProfileRole {
  const normalized = value === "student" ? "alumno" : value;
  const parsed = ProfileRoleSchema.safeParse(normalized);

  if (parsed.success) {
    return parsed.data;
  }

  return "alumno";
}

export const UserProfileDtoSchema = withObjectKeyAliases({
    id: uuidSchema,
    display_name: nonEmptyTextSchema,
    email: z.string().email(),
    avatar_url: z.string().url().max(2048).nullable(),
    bio: z.string().max(500).nullable(),
    role: ProfileRoleSchema,
    created_at: isoDateTimeSchema,
  }, {
    displayName: "display_name",
    avatarUrl: "avatar_url",
    createdAt: "created_at",
  });

export type UserProfileDto = z.infer<typeof UserProfileDtoSchema>;

export const UserProfileBootstrapSchema = withObjectKeyAliases({
    display_name: nonEmptyTextSchema.optional(),
    avatar_url: z.string().url().max(2048).nullable().optional(),
    bio: z
      .string()
      .trim()
      .max(500)
      .transform((value) => (value.length === 0 ? null : value))
      .nullable()
      .optional(),
  }, {
    displayName: "display_name",
    avatarUrl: "avatar_url",
  });

export const UserProfileUpdateSchema = withObjectKeyAliases({
    display_name: nonEmptyTextSchema.optional(),
    email: z.string().email().optional(),
    avatar_url: z.string().url().max(2048).nullable().optional(),
    bio: z
      .string()
      .trim()
      .max(500)
      .transform((value) => (value.length === 0 ? null : value))
      .nullable()
      .optional(),
  }, {
    displayName: "display_name",
    avatarUrl: "avatar_url",
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "Debe incluir al menos un campo para actualizar",
  });

export const UserProvisionSchema = withObjectKeyAliases({
    display_name: nonEmptyTextSchema,
    email: z.string().email(),
    role: z.enum(["moderador", "instructor"]),
  }, {
    displayName: "display_name",
  });

export const UserAuthContextSchema = withObjectKeyAliases({
    user_id: uuidSchema,
    email: z.string().email(),
    role: ProfileRoleSchema,
  }, {
    userId: "user_id",
  });

export const UserProfileEnvelopeSchema = z
  .object({
    auth: UserAuthContextSchema,
    profile: UserProfileDtoSchema,
  })
  .strict();

export const UserProfileExportRowSchema = withObjectKeyAliases({
  id: uuidSchema,
  display_name: nonEmptyTextSchema,
  email: z.string().email(),
  role: ProfileRoleSchema,
}, {
  displayName: "display_name",
});

export type UserProfileExportRow = z.infer<typeof UserProfileExportRowSchema>;
