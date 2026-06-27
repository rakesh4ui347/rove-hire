import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { addDays } from "date-fns";
import {
  generateNDAPdf,
  generateOfferLetterPdf,
  generateSampleResumePdf,
} from "../src/lib/pdf";
import { HR_TEST_CREDENTIALS } from "../src/lib/constants";
import { getRelativePath, saveFile } from "../src/lib/storage";

const prisma = new PrismaClient();

function scheduledAt(daysFromNow: number, hours: number, minutes = 0): Date {
  const date = addDays(new Date(), daysFromNow);
  date.setHours(hours, minutes, 0, 0);
  return date;
}

async function seedDocument(
  candidateId: string,
  type: "RESUME" | "OFFER_LETTER" | "NDA",
  filename: string,
  data: Buffer,
  subdir: string
) {
  const filePath = await saveFile(filename, data, subdir);
  await prisma.document.create({
    data: {
      candidateId,
      type,
      filename,
      path: getRelativePath(filePath),
      fileSize: data.length,
      mimeType: "application/pdf",
    },
  });
}

async function main() {
  console.log("Seeding database...");

  await prisma.timelineEvent.deleteMany();
  await prisma.magicLink.deleteMany();
  await prisma.interview.deleteMany();
  await prisma.document.deleteMany();
  await prisma.offerDetails.deleteMany();
  await prisma.candidate.deleteMany();
  await prisma.jobOpening.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash(HR_TEST_CREDENTIALS.password, 10);
  await prisma.user.create({
    data: {
      email: HR_TEST_CREDENTIALS.email,
      password: hashedPassword,
      name: "Sarah Chen",
    },
  });

  const jobs = await Promise.all([
    prisma.jobOpening.create({
      data: {
        title: "Senior Full-Stack Engineer",
        description:
          "Build and scale ROVE's cloud platform connecting dashcams, mobile apps, and fleet dashboards. You'll own features end-to-end from API design to polished UI.",
        skills: "TypeScript, React, Node.js, PostgreSQL, AWS",
        status: "OPEN",
      },
    }),
    prisma.jobOpening.create({
      data: {
        title: "Product Designer",
        description:
          "Shape the experience of ROVE's driver and fleet manager products. Strong systems thinking and interaction design for hardware-software experiences.",
        skills: "Figma, Design Systems, UX Research, Prototyping",
        status: "OPEN",
      },
    }),
    prisma.jobOpening.create({
      data: {
        title: "DevOps Engineer",
        description:
          "Maintain ROVE's infrastructure for video ingestion, real-time alerts, and global device fleet. Focus on reliability, observability, and cost efficiency.",
        skills: "Kubernetes, Terraform, AWS, CI/CD, Monitoring",
        status: "CLOSED",
      },
    }),
  ]);

  const [engJob, designJob] = jobs;

  const mayaResume = Buffer.from(await generateSampleResumePdf("Maya Torres"));
  const maya = await prisma.candidate.create({
    data: {
      name: "Maya Torres",
      email: "maya.torres@example.com",
      status: "APPLIED",
      jobOpeningId: engJob.id,
    },
  });
  await seedDocument(maya.id, "RESUME", "maya-torres-resume.pdf", mayaResume, "resumes");
  const mayaToken = randomUUID();
  await prisma.magicLink.create({
    data: { token: mayaToken, candidateId: maya.id, expiresAt: addDays(new Date(), 14) },
  });
  await prisma.timelineEvent.create({
    data: {
      candidateId: maya.id,
      type: "APPLIED",
      title: "Candidate added",
      description: "Resume uploaded. Application link ready to share.",
    },
  });

  const jamesResume = Buffer.from(await generateSampleResumePdf("James Okonkwo"));
  const james = await prisma.candidate.create({
    data: {
      name: "James Okonkwo",
      email: "james.okonkwo@example.com",
      status: "FORM_SUBMITTED",
      jobOpeningId: engJob.id,
      phone: "+1 (415) 555-0142",
      location: "San Francisco, CA",
      currentRole: "Staff Engineer at Streamline",
      noticePeriod: "3 weeks",
      salaryExpectation: 175000,
      salaryCurrency: "USD",
      linkedInUrl: "https://linkedin.com/in/jamesokonkwo",
    },
  });
  await seedDocument(james.id, "RESUME", "james-okonkwo-resume.pdf", jamesResume, "resumes");
  await prisma.timelineEvent.createMany({
    data: [
      {
        candidateId: james.id,
        type: "APPLIED",
        title: "Candidate added",
        description: "Resume uploaded for Senior Full-Stack Engineer.",
      },
      {
        candidateId: james.id,
        type: "FORM_SUBMITTED",
        title: "Application form submitted",
        description: "Candidate completed their application details.",
      },
    ],
  });

  const priyaResume = Buffer.from(await generateSampleResumePdf("Priya Sharma"));
  const priya = await prisma.candidate.create({
    data: {
      name: "Priya Sharma",
      email: "priya.sharma@example.com",
      status: "INTERVIEW_SCHEDULED",
      jobOpeningId: designJob.id,
      phone: "+1 (206) 555-0198",
      location: "Seattle, WA",
      currentRole: "Senior Product Designer at Horizon",
      noticePeriod: "2 weeks",
      salaryExpectation: 147500,
      salaryCurrency: "USD",
      linkedInUrl: "https://linkedin.com/in/priyasharma",
    },
  });
  await seedDocument(priya.id, "RESUME", "priya-sharma-resume.pdf", priyaResume, "resumes");
  await prisma.interview.create({
    data: {
      candidateId: priya.id,
      scheduledAt: scheduledAt(3, 10),
      type: "TECHNICAL",
      interviewerName: "Alex Rivera",
      notes: "Portfolio deep-dive and design critique",
      status: "COMPLETED",
      feedbackRecommendation: "HIRE",
      feedbackNote: "Strong systems thinking. Excellent portfolio. Recommend moving to offer.",
      completedAt: new Date(),
    },
  });
  await prisma.interview.create({
    data: {
      candidateId: priya.id,
      scheduledAt: scheduledAt(7, 14),
      type: "SCREENING",
      interviewerName: "Sarah Chen",
      notes: "Culture and team fit",
      status: "SCHEDULED",
    },
  });
  await prisma.timelineEvent.createMany({
    data: [
      {
        candidateId: priya.id,
        type: "APPLIED",
        title: "Candidate added",
        description: "Resume uploaded for Product Designer.",
      },
      {
        candidateId: priya.id,
        type: "FORM_SUBMITTED",
        title: "Application form submitted",
        description: "Candidate completed their application details.",
      },
      {
        candidateId: priya.id,
        type: "INTERVIEW_COMPLETED",
        title: "Interview feedback recorded",
        description: "Hire — Strong systems thinking. Excellent portfolio.",
      },
      {
        candidateId: priya.id,
        type: "INTERVIEW_SCHEDULED",
        title: "Screening interview scheduled",
        description: "Sarah Chen · upcoming culture fit",
      },
    ],
  });

  const danielResume = Buffer.from(await generateSampleResumePdf("Daniel Kim"));
  const daniel = await prisma.candidate.create({
    data: {
      name: "Daniel Kim",
      email: "daniel.kim@example.com",
      status: "OFFER_SENT",
      jobOpeningId: engJob.id,
      phone: "+1 (512) 555-0177",
      location: "Austin, TX",
      currentRole: "Full-Stack Engineer at NovaTech",
      noticePeriod: "2 weeks",
      salaryExpectation: 160000,
      salaryCurrency: "USD",
      linkedInUrl: "https://linkedin.com/in/danielkim",
    },
  });
  await seedDocument(daniel.id, "RESUME", "daniel-kim-resume.pdf", danielResume, "resumes");

  const offerStart = addDays(new Date(), 30);
  const offerBytes = Buffer.from(
    await generateOfferLetterPdf({
      candidateName: "Daniel Kim",
      roleTitle: "Senior Full-Stack Engineer",
      salaryAmount: 165000,
      salaryCurrency: "USD",
      startDate: offerStart,
      reportingManager: "Marcus Webb",
      location: "Austin, TX (Hybrid)",
    })
  );
  const ndaBytes = Buffer.from(await generateNDAPdf({ candidateName: "Daniel Kim" }));

  await prisma.offerDetails.create({
    data: {
      candidateId: daniel.id,
      roleTitle: "Senior Full-Stack Engineer",
      salaryCurrency: "USD",
      salaryAmount: 165000,
      startDate: offerStart,
      reportingManager: "Marcus Webb",
      location: "Austin, TX (Hybrid)",
    },
  });
  await seedDocument(daniel.id, "OFFER_LETTER", "offer-letter-daniel-kim.pdf", offerBytes, "offers");
  await seedDocument(daniel.id, "NDA", "nda-daniel-kim.pdf", ndaBytes, "offers");
  await prisma.timelineEvent.createMany({
    data: [
      {
        candidateId: daniel.id,
        type: "APPLIED",
        title: "Candidate added",
        description: "Resume uploaded.",
      },
      {
        candidateId: daniel.id,
        type: "FORM_SUBMITTED",
        title: "Application form submitted",
        description: "Candidate completed their application details.",
      },
      {
        candidateId: daniel.id,
        type: "INTERVIEW_COMPLETED",
        title: "Interview feedback recorded",
        description: "Hire — Strong technical depth and culture fit.",
      },
      {
        candidateId: daniel.id,
        type: "OFFER_GENERATED",
        title: "Offer documents generated",
        description: "Offer letter and NDA created for Senior Full-Stack Engineer at $165,000.",
      },
    ],
  });

  const elenaResume = Buffer.from(await generateSampleResumePdf("Elena Vasquez"));
  const elena = await prisma.candidate.create({
    data: {
      name: "Elena Vasquez",
      email: "elena.vasquez@example.com",
      status: "REJECTED",
      jobOpeningId: engJob.id,
      phone: "+1 (303) 555-0133",
      location: "Denver, CO",
      currentRole: "Software Engineer at PeakData",
      noticePeriod: "Immediate",
      salaryExpectation: 130000,
      salaryCurrency: "USD",
      rejectionReason: "Insufficient experience with distributed systems at scale.",
    },
  });
  await seedDocument(elena.id, "RESUME", "elena-vasquez-resume.pdf", elenaResume, "resumes");
  await prisma.timelineEvent.createMany({
    data: [
      {
        candidateId: elena.id,
        type: "APPLIED",
        title: "Candidate added",
        description: "Resume uploaded.",
      },
      {
        candidateId: elena.id,
        type: "FORM_SUBMITTED",
        title: "Application form submitted",
        description: "Candidate completed their application details.",
      },
      {
        candidateId: elena.id,
        type: "REJECTED",
        title: "Candidate rejected",
        description: "Insufficient experience with distributed systems at scale.",
      },
    ],
  });

  console.log("Seed complete!");
  console.log(`HR login: ${HR_TEST_CREDENTIALS.email} / ${HR_TEST_CREDENTIALS.password}`);
  console.log(`Maya magic link: /apply/${mayaToken}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
