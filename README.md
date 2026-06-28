# ROVE Hire



Internal recruitment tool for ROVE HR — manage candidates from resume intake through offer letter generation.



## Live demo



**https://rove-hire-gamma.vercel.app**



Sign in with the test credentials below. The production database is seeded with sample jobs and candidates across all pipeline stages.



## Test credentials



| Field | Value |

|-------|-------|

| Email | `hr@rove.com` |

| Password | `RoveHire2024!` |



Pre-seeded data: 3 job openings and 5 candidates (Applied, Form Submitted, Interview Scheduled, Offer Sent, Rejected).



Print demo links for recording:



```bash

DEMO_URL=https://rove-hire-gamma.vercel.app npm run demo:info

```



See [`docs/DEMO_SCRIPT.md`](docs/DEMO_SCRIPT.md) for the video walkthrough script.



## Quick start



```bash

npm install

npm run db:push

npm run db:seed   # requires Supabase env vars — see below

npm run dev

```



Open [http://localhost:3000](http://localhost:3000).



## Tech stack



| Layer | Choice | Why |

|-------|--------|-----|

| Frontend | Next.js 15 (App Router) | Required by brief; unified routing, SSR, and API in one codebase |

| Backend | Next.js Server Actions + API routes | No separate service needed; fast to ship for a focused internal tool |

| Database | PostgreSQL + Prisma | Relational model fits candidates, jobs, interviews, and timeline events; works on Neon/Vercel |

| Auth | NextAuth (credentials) | Simple HR-only email/password login without OAuth setup |

| File storage | Supabase Storage | Resumes and generated PDFs persist in `resumes`, `offers`, and `nda` buckets; re-downloadable after refresh |

| PDF generation | pdf-lib | Programmatic PDF layout without headless Chrome; lightweight and runs in serverless |

| Styling | Tailwind CSS v4 | Utility-first styling for a polished, Linear-inspired internal UI |

| Hosting | Vercel | Zero-config Next.js deploy with environment-based configuration |



## PDF generation approach



Offer letters and NDAs are built with **pdf-lib**: embed standard fonts, draw header/branding, body paragraphs, and signature blocks. Generated PDFs are uploaded to Supabase Storage and referenced in the `Document` table so HR can re-download later.



At scale, I would move to HTML templates (React-PDF or Puppeteer) for richer layouts, add async job queues for generation, and version templates per role/region.



## UX decisions



- **Dark sidebar + light content area** — mirrors tools like Linear; keeps navigation always visible

- **Status-colored badges** — pipeline stage is scannable at a glance on dashboard and profile

- **Candidate profile as spine** — timeline, actions, and documents live on one page; actions change by status

- **Magic link copy UX** — link surfaced immediately after adding a candidate; no email integration needed

- **Markdown job descriptions** — lightweight formatting on create; rendered on job list and detail pages

- **Loading skeletons** — dashboard, jobs, interviews, candidate profile, and add-candidate form

- **Error boundaries** — global and HR-scoped error pages with retry

- **Toast feedback** — success and error toasts on all major HR actions



## What I would do next



- Email notifications (magic link, interview invites, offer sent)

- Calendar integration for interviews

- Candidate search with full-text and bulk actions

- Role-based access (hiring manager vs HR admin)

- E2E tests for critical flows (apply, schedule, generate offer, hire)

- Automated tests and CI



## Known limitations



- PDF templates are programmatic, not WYSIWYG — fine for demo, would use designer-friendly templates in prod

- No automated test suite yet

- File uploads limited to PDF only (as specified)

- Supabase and Vercel env vars must be configured before seeding or uploading files

- No real email delivery (magic link is copy-only, by design)



## Hosting (Vercel)



Deployed at **https://rove-hire-gamma.vercel.app**.



### Required environment variables



Set these in **Vercel → Project → Settings → Environment Variables** for **Production** (and Preview if you test there):



| Variable | Required | Notes |

|----------|----------|-------|

| `DATABASE_URL` | Yes | Supabase **transaction pooler** (port **6543**, `?pgbouncer=true`) — not session mode (5432) |
| `DIRECT_URL` | Yes (Supabase) | Direct DB URL (`db.[ref].supabase.co:5432`) for `prisma db push` / migrations |

| `NEXTAUTH_SECRET` | Yes | Random string — `openssl rand -base64 32` |

| `NEXTAUTH_URL` | Recommended | Production URL — **do not** use `http://localhost:3000` on Vercel; omit to auto-detect from `VERCEL_URL` |

| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |

| `SUPABASE_SERVICE_ROLE_KEY` | Yes | **service_role** key (not anon) — Supabase → Settings → API |



### Supabase storage setup



1. In `.env`, set `SUPABASE_SERVICE_ROLE_KEY` to the **service_role** secret (not the `anon` key).

2. Run [`supabase/storage.sql`](supabase/storage.sql) in the Supabase SQL editor to create `resumes`, `offers`, and `nda` buckets.

3. Restart the dev server after changing `.env`.



If offer generation fails with **"row-level security policy"**, the usual cause is the anon key being used instead of `service_role`.



After adding env vars, **redeploy** (env changes do not apply to existing deployments until redeployed).



### `max clients reached in session mode` (EMAXCONNSESSION)



This means **`DATABASE_URL` on Vercel still uses Supabase session pooler (port 5432)**. Serverless needs the **transaction pooler**:



1. Supabase Dashboard → **Settings** → **Database** → **Connection string**
2. Mode: **Transaction pooler** → copy URI (host ends with `pooler.supabase.com`, port **6543**)
3. Append `?pgbouncer=true&connection_limit=1` if not already present
4. URL-encode special characters in the password (`@` → `%40`)
5. In Vercel, set **`DATABASE_URL`** to that URI and **`DIRECT_URL`** to the **Direct connection** URI (`db.[ref].supabase.co:5432`)
6. **Redeploy**



Do **not** use the Session pooler (port 5432) for `DATABASE_URL` on Vercel.



**Quick fix:** Copy `DATABASE_URL` and `DIRECT_URL` from your local `.env` (they should use port **6543** on `pooler.supabase.com`) into Vercel → Settings → Environment Variables → **Production**, then **Redeploy**. Env changes do not apply until you redeploy.



Seed the production database once:



```bash

DATABASE_URL="your-production-url" npx prisma db push

DATABASE_URL="your-production-url" npx prisma db seed

```



### Login loop after deploy?



Sign-in succeeds but you return to `/login` when:



1. **`NEXTAUTH_SECRET` is missing on Vercel** — most common cause

2. **`DATABASE_URL` is wrong** — user lookup fails (you'd see "Invalid email or password" instead)

3. **Database not seeded** — no `hr@rove.com` user exists



Test credentials: `hr@rove.com` / `RoveHire2024!`

