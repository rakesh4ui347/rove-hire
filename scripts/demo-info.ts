/**
 * Prints demo credentials, seeded candidate links, and magic apply URLs.
 *
 * Usage:
 *   npm run demo:info
 *   DEMO_URL=https://rove-hire-gamma.vercel.app npm run demo:info
 */
import { PrismaClient } from "@prisma/client";

import { HR_TEST_CREDENTIALS } from "../src/lib/constants";
import { getAuthUrl } from "../src/lib/auth-env";

const prisma = new PrismaClient();

const STATUS_ORDER = [
  "APPLIED",
  "FORM_SUBMITTED",
  "INTERVIEW_SCHEDULED",
  "OFFER_SENT",
  "HIRED",
  "REJECTED",
] as const;

async function main() {
  const baseUrl = (process.env.DEMO_URL || getAuthUrl()).replace(/\/$/, "");

  console.log("\n══════════════════════════════════════════");
  console.log("  ROVE Hire — Demo Info");
  console.log("══════════════════════════════════════════\n");

  console.log("Live URL:");
  console.log(`  ${baseUrl}\n`);

  console.log("HR credentials:");
  console.log(`  Email:    ${HR_TEST_CREDENTIALS.email}`);
  console.log(`  Password: ${HR_TEST_CREDENTIALS.password}\n`);

  const jobs = await prisma.jobOpening.findMany({
    select: {
      id: true,
      title: true,
      status: true,
      _count: { select: { candidates: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  console.log(`Job openings (${jobs.length}):`);
  for (const job of jobs) {
    console.log(
      `  • ${job.title} [${job.status}] — ${job._count.candidates} candidate(s)`
    );
    console.log(`    ${baseUrl}/jobs/${job.id}`);
  }
  console.log();

  const candidates = await prisma.candidate.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      status: true,
      magicLinks: {
        where: {
          isUsed: false,
          expiresAt: { gt: new Date() },
        },
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { token: true },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  const sorted = [...candidates].sort(
    (a, b) =>
      STATUS_ORDER.indexOf(a.status as (typeof STATUS_ORDER)[number]) -
      STATUS_ORDER.indexOf(b.status as (typeof STATUS_ORDER)[number])
  );

  console.log(`Candidates (${sorted.length}):`);
  for (const candidate of sorted) {
    console.log(`  • ${candidate.name} — ${candidate.status}`);
    console.log(`    Profile: ${baseUrl}/candidates/${candidate.id}`);

    const token = candidate.magicLinks[0]?.token;
    if (token) {
      console.log(`    Apply:   ${baseUrl}/apply/${token}`);
    }
  }
  console.log();

  console.log("Key pages:");
  const pages = [
    ["Login", "/login"],
    ["Dashboard", "/dashboard"],
    ["Jobs", "/jobs"],
    ["Add candidate", "/candidates/new"],
    ["Interviews", "/interviews"],
  ] as const;

  for (const [label, path] of pages) {
    console.log(`  ${label.padEnd(16)} ${baseUrl}${path}`);
  }

  console.log("\nDemo video script: docs/DEMO_SCRIPT.md");
  console.log("══════════════════════════════════════════\n");
}

main()
  .catch((error) => {
    console.error("Failed to load demo info:", error);
    console.error(
      "\nEnsure DATABASE_URL is set and the database is seeded (npm run db:seed)."
    );
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
