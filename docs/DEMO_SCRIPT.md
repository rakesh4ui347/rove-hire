# ROVE Hire — Demo Video Script

Use this script to record the **3–5 minute walkthrough** required for submission.  
Suggested tool: Loom, QuickTime, or OBS. Record at **1920×1080** if possible.

---

## Before you record

1. Deploy the app and confirm login works on the live URL.
2. Seed production (or local) data:
   ```bash
   npm run db:push
   npm run db:seed
   ```
3. Print demo links and credentials:
   ```bash
   DEMO_URL=https://your-app.vercel.app npm run demo:info
   ```
4. Open two browser windows:
   - **Window A:** HR session (Chrome, signed in)
   - **Window B:** Incognito/private (for candidate magic link)
5. Close unrelated tabs. Zoom browser to 100%.

---

## Credentials

| Role | Email | Password |
|------|-------|----------|
| HR | `hr@rove.com` | `RoveHire2024!` |

---

## Seeded data (what evaluators should see immediately)

| Candidate | Status | What to show |
|-----------|--------|--------------|
| Maya Torres | Applied | Magic link ready; no form submitted yet |
| James Okonkwo | Form Submitted | Full application details on profile |
| Priya Sharma | Interview Scheduled | Completed technical feedback + upcoming screening |
| Daniel Kim | Offer Sent | Downloadable offer letter + NDA PDFs |
| Elena Vasquez | Rejected | Rejection reason in timeline |

**Jobs:** Senior Full-Stack Engineer (Open), Product Designer (Open), DevOps Engineer (Closed)

---

## Recording outline (~4 minutes)

### 1. HR sign-in & dashboard (0:00 – 0:45)

**Caption:** *HR sign-in → pipeline dashboard*

- Go to `/login`
- Sign in with test credentials
- Land on `/dashboard`
- Point out: candidate name, role, status badge, last activity
- **Filter:** click "Interview Scheduled" — show Priya
- **Search:** type "Daniel" — show Daniel Kim
- Clear filters; mention stat cards (candidates, interviews, offers, hired)

---

### 2. Job openings (0:45 – 1:10)

**Caption:** *Job list with candidate counts*

- Sidebar → **Jobs** (`/jobs`)
- Show 3 openings and candidate counts on each card
- Open **DevOps Engineer** (Closed) — note no "Add candidate" for closed roles
- Click **Create Job** — briefly show form fields (title, description, skills, status)
- Cancel or create a throwaway job (optional; skip if short on time)

---

### 3. Add candidate + magic link (1:10 – 1:50)

**Caption:** *Add candidate → copy application link*

- Sidebar → **Add Candidate** (`/candidates/new`)
- Fill: name, email (use a **new** email e.g. `demo.candidate@example.com`)
- Select open job opening
- Upload a PDF resume (drag-and-drop zone)
- Submit → success toast + magic link screen
- Click **Copy link**

---

### 4. Candidate application (public, no login) (1:50 – 2:20)

**Caption:** *Candidate completes application (public page)*

- Switch to **Incognito window**
- Paste magic link → `/apply/[token]`
- Fill: phone, location, current role, notice period, salary, LinkedIn
- Submit → confirmation screen ("Application submitted!")
- Try opening the same link again → "already submitted" message (one-time use)

---

### 5. Schedule interview (2:20 – 2:50)

**Caption:** *Schedule interview from candidate profile*

- Back to HR window → open the new candidate's profile (or Maya Torres)
- Sidebar/right panel → **Schedule Interview**
- Set date, time, type (Screening/Technical), interviewer, notes
- Submit → success toast; form clears
- Scroll to **Timeline** — new "interview scheduled" event
- Sidebar → **Interviews** — new row appears, sorted by date

---

### 6. Interview feedback (2:50 – 3:15)

**Caption:** *Mark interview completed + feedback*

- Open **Priya Sharma** profile (`/candidates/[id]`)
- Under Interviews → **Mark Completed**
- Select recommendation (Hire / Maybe / No Hire) + optional note
- Submit → success toast; feedback visible on profile

---

### 7. Generate offer documents (3:15 – 3:45)

**Caption:** *Generate offer letter + NDA PDFs*

- Open **Daniel Kim** (already Offer Sent) OR use Priya after feedback
- Click **Generate Offer Documents**
- Fill: role title, salary, currency, start date, manager, location
- Generate → success toast
- Scroll to **Documents** — download Offer Letter and NDA
- Open PDFs briefly to show professional layout (header, body, signatures)

---

### 8. Mark as hired (3:45 – 4:10)

**Caption:** *Mark candidate as hired*

- On Daniel Kim's profile (offer already generated)
- **Final Decision** → **Mark as Hired**
- Success toast; status badge updates; timeline shows "Candidate hired"
- Return to dashboard — Hired stat increments

---

### 9. Reject flow (optional, 4:10 – 4:30)

**Caption:** *Reject with reason*

- Open a non-terminal candidate OR mention **Elena Vasquez** (pre-seeded Rejected)
- Show Elena's timeline with rejection reason
- Optionally live-demo reject on a test candidate: reason required, toast on success

---

### 10. Wrap-up (4:30 – 4:45)

**Caption:** *End-to-end recruitment in one tool*

- Quick pan: Dashboard → Profile → Interviews → Documents
- Mention: data persists after refresh; resumes/PDFs re-downloadable

---

## Quick paths (copy-paste while recording)

Run `npm run demo:info` to print live URLs for your environment.

| Page | Path |
|------|------|
| Login | `/login` |
| Dashboard | `/dashboard` |
| Jobs | `/jobs` |
| Add candidate | `/candidates/new` |
| Interviews | `/interviews` |
| Maya (Applied) | `/candidates` → click Maya Torres |
| Daniel (Offer Sent) | `/candidates` → click Daniel Kim |
| Elena (Rejected) | `/candidates` → click Elena Vasquez |

---

## Submission checklist

- [ ] Live URL works (login + seeded data visible)
- [ ] GitHub repo link (add `careers@rovedashcam.com` if private)
- [ ] Test credentials in README
- [ ] Demo video uploaded (Loom/Drive link in email)
- [ ] README updated (accurate stack, hosting URL, PDF approach, next steps)
- [ ] Email subject: `Assignment Submission - <Your Name> - Full-Stack Developer`

---

## Troubleshooting during demo

| Issue | Fix |
|-------|-----|
| Login loop after deploy | Set `NEXTAUTH_SECRET` + `NEXTAUTH_URL` on Vercel, redeploy |
| Resume upload fails | Check Supabase env vars + run `supabase/storage.sql` |
| Empty dashboard | Run `npm run db:seed` against production `DATABASE_URL` |
| Magic link expired | Re-seed or add a new candidate to get a fresh link |
| Duplicate email error | Use a unique email when adding candidates live |
