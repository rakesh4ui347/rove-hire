/**
 * NextAuth reads NEXTAUTH_URL and NEXTAUTH_SECRET from the environment.
 * On Vercel, NEXTAUTH_URL is often missing while VERCEL_URL is set automatically.
 */
export function resolveAuthEnv() {
  if (process.env.NEXTAUTH_URL) {
    return;
  }

  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    process.env.NEXTAUTH_URL = `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
    return;
  }

  if (process.env.VERCEL_URL) {
    process.env.NEXTAUTH_URL = `https://${process.env.VERCEL_URL}`;
  }
}

export function getAuthSecret() {
  return process.env.NEXTAUTH_SECRET;
}

export function getAuthUrl() {
  resolveAuthEnv();
  return process.env.NEXTAUTH_URL ?? "http://localhost:3000";
}

export function shouldUseSecureAuthCookies() {
  return (
    process.env.NODE_ENV === "production" ||
    getAuthUrl().startsWith("https://")
  );
}
