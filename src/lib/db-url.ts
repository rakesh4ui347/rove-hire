/**
 * Supabase session pooler (port 5432) allows ~15 connections and exhausts quickly
 * on Vercel/serverless. The app must use the transaction pooler (port 6543).
 */
export function assertServerlessDatabaseUrl(databaseUrl: string | undefined) {
  if (!databaseUrl) return;

  const isSupabaseSessionPooler =
    /pooler\.supabase\.com:5432/i.test(databaseUrl) ||
    (/pooler\.supabase\.com/i.test(databaseUrl) &&
      !databaseUrl.includes(":6543") &&
      !databaseUrl.includes("pgbouncer=true"));

  if (isSupabaseSessionPooler) {
    throw new Error(
      "DATABASE_URL uses Supabase session pooler (port 5432), which limits connections to ~15. " +
        "In Supabase Dashboard → Settings → Database, copy the Transaction pooler URI (port 6543) " +
        "and set DATABASE_URL with ?pgbouncer=true&connection_limit=1. " +
        "Use DIRECT_URL (direct connection, port 5432 on db.[ref].supabase.co) for prisma db push."
    );
  }
}
