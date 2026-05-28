import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { loadConfig } from "../config";

let supabaseClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (supabaseClient) {
    return supabaseClient;
  }

  const config = loadConfig();

  supabaseClient = createClient(config.SUPABASE_URL, config.SUPABASE_SERVICE_ROLE_KEY, {
    db: {
      schema: "cursos",
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  }) as unknown as SupabaseClient;

  return supabaseClient;
}

export const supabase = getSupabaseClient();