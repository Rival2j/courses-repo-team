import postgres from "postgres";
import { loadConfig } from "../config";

let databaseClient: any = null;

export function getDatabaseClient(): any {
  if (databaseClient) {
    return databaseClient;
  }

  databaseClient = postgres(loadConfig().SUPABASE_CONNECTION_STRING, {
    // Keep the shared client small to avoid exhausting the Supabase session pool
    // during integration tests and multi-request admin flows.
    max: 1,
    prepare: false,
  });

  return databaseClient;
}

export async function closeDatabaseClient(): Promise<void> {
  if (!databaseClient) {
    return;
  }

  const client = databaseClient;
  databaseClient = null;
  await client.end({ timeout: 5 });
}