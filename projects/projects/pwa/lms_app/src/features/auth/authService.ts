import type { Session } from "@supabase/supabase-js";
import { lmsApi } from "../../lib/api";
import { supabase } from "../../lib/supabaseClient";

export interface AuthUserProfile {
  displayName: string;
  email: string;
}

function ensureSupabase() {
  if (!supabase) {
    throw new Error("Supabase no está configurado para esta PWA.");
  }

  return supabase;
}

export async function getCurrentSession(): Promise<Session | null> {
  const client = ensureSupabase();
  const { data, error } = await client.auth.getSession();

  if (error) {
    throw new Error(error.message);
  }

  return data.session;
}

export async function registerWithEmail(input: {
  displayName: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}): Promise<Session | null> {
  if (input.password !== input.passwordConfirmation) {
    throw new Error("Las contraseñas no coinciden.");
  }

  const client = ensureSupabase();
  const { data, error } = await client.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      data: {
        display_name: input.displayName,
      },
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  if (data.session) {
    await lmsApi.bootstrapCurrentUser({ displayName: input.displayName });
  }

  return data.session;
}

export async function loginWithEmail(input: {
  email: string;
  password: string;
}): Promise<Session> {
  const client = ensureSupabase();
  const { data, error } = await client.auth.signInWithPassword({
    email: input.email,
    password: input.password,
  });

  if (error) {
    throw new Error(error.message);
  }

  if (!data.session) {
    throw new Error("No se recibió una sesión válida.");
  }

  try {
    await lmsApi.getCurrentUserProfile();
  } catch {
    await lmsApi.bootstrapCurrentUser({});
  }

  return data.session;
}

export async function logout(): Promise<void> {
  const client = ensureSupabase();
  const { error } = await client.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }
}

export function getSessionFallbackProfile(session: Session): AuthUserProfile {
  const metadata = session.user.user_metadata ?? {};
  const displayName =
    typeof metadata.display_name === "string" && metadata.display_name.trim()
      ? metadata.display_name.trim()
      : session.user.email?.split("@")[0] ?? "Usuario";

  return {
    displayName,
    email: session.user.email ?? "",
  };
}
