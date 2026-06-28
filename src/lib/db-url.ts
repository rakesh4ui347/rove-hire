const SESSION_POOLER_MESSAGE =
  "DATABASE_URL uses Supabase session pooler (port 5432), which limits connections to ~15. " +
  "In Supabase Dashboard → Settings → Database, copy the Transaction pooler URI (port 6543) " +
  "and set DATABASE_URL with ?pgbouncer=true&connection_limit=1. " +
  "Use DIRECT_URL (direct connection, port 5432 on db.[ref].supabase.co) for prisma db push.";

function isSupabaseSessionPooler(databaseUrl: string): boolean {
  return (
    /pooler\.supabase\.com:5432/i.test(databaseUrl) ||
    (/pooler\.supabase\.com/i.test(databaseUrl) &&
      !databaseUrl.includes(":6543") &&
      !databaseUrl.includes("pgbouncer=true"))
  );
}

function isNextBuildPhase(): boolean {
  return process.env.NEXT_PHASE === "phase-production-build";
}

/**
 * Supabase session pooler (port 5432) allows ~15 connections and exhausts quickly
 * on Vercel/serverless. The app must use the transaction pooler (port 6543).
 */
export function assertServerlessDatabaseUrl(databaseUrl: string | undefined) {
  if (!databaseUrl || !isSupabaseSessionPooler(databaseUrl)) return;

  // Don't block `next build` — Vercel injects env at build time; warn instead.
  if (isNextBuildPhase()) {
    console.warn(`[rove-hire] ${SESSION_POOLER_MESSAGE}`);
    return;
  }

  if (process.env.VERCEL) {
    throw new Error(SESSION_POOLER_MESSAGE);
  }

  console.warn(`[rove-hire] ${SESSION_POOLER_MESSAGE}`);
}

export function getSessionPoolerMessage(): string {
  return SESSION_POOLER_MESSAGE;
}
