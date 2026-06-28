import { headers } from "next/headers";

function isLocalhostUrl(url: string): boolean {
  try {
    const { hostname } = new URL(url);
    return (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "::1"
    );
  } catch {
    return false;
  }
}

/**
 * NextAuth reads NEXTAUTH_URL and NEXTAUTH_SECRET from the environment.
 * On Vercel, NEXTAUTH_URL is often missing (or copied from local .env as localhost)
 * while VERCEL_URL is set automatically.
 */
export function resolveAuthEnv() {
  const configured = process.env.NEXTAUTH_URL;
  const onVercel = Boolean(process.env.VERCEL);

  if (configured && !(onVercel && isLocalhostUrl(configured))) {
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

/** Public-facing app URL for magic links — prefers the current request host. */
export async function getPublicAppUrl(): Promise<string> {
  try {
    const h = await headers();
    const host = h.get("x-forwarded-host") ?? h.get("host");
    if (host) {
      const proto =
        h.get("x-forwarded-proto") ??
        (host.includes("localhost") ? "http" : "https");
      return `${proto}://${host}`;
    }
  } catch {
    // headers() is unavailable outside a request (scripts, etc.)
  }

  return getAuthUrl();
}

export function shouldUseSecureAuthCookies() {
  return (
    process.env.NODE_ENV === "production" ||
    getAuthUrl().startsWith("https://")
  );
}
