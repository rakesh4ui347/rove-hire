const SESSION_POOLER_MESSAGE =
  "DATABASE_URL uses Supabase session pooler (port 5432), which limits connections to ~15 on Vercel. " +
  "In Supabase Dashboard → Settings → Database, copy the Transaction pooler URI (port 6543) " +
  "and set DATABASE_URL on Vercel with ?pgbouncer=true&connection_limit=1. " +
  "Use DIRECT_URL (direct connection on db.[ref].supabase.co:5432) for prisma db push.";

function isSupabaseSessionPooler(databaseUrl: string): boolean {
  return (
    /pooler\.supabase\.com:5432/i.test(databaseUrl) ||
    (/pooler\.supabase\.com/i.test(databaseUrl) &&
      !databaseUrl.includes(":6543") &&
      !databaseUrl.includes("pgbouncer=true"))
  );
}

/** Log a warning when DATABASE_URL uses Supabase session pooler (port 5432). */
export function warnOnSessionPooler(databaseUrl: string | undefined) {
  if (!databaseUrl || !isSupabaseSessionPooler(databaseUrl)) return;
  console.warn(`[rove-hire] ${SESSION_POOLER_MESSAGE}`);
}

export function getSessionPoolerMessage(): string {
  return SESSION_POOLER_MESSAGE;
}
