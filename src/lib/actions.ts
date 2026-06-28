"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/session";
import { generateOfferLetterPdf, generateNDAPdf } from "@/lib/pdf";
import { MAGIC_LINK_EXPIRY_DAYS } from "@/lib/constants";
import { randomUUID } from "crypto";
import { getPublicAppUrl } from "@/lib/auth-env";
import {
  removeDocumentFiles,
  removeFiles,
  uploadFile,
} from "@/lib/supabase-storage";
import {
  CandidateStatus,
  FeedbackRecommendation,
  InterviewType,
  JobStatus,
  Prisma,
  TimelineEventType,
} from "@prisma/client";


async function addTimelineEvent(
  candidateId: string,
  type: TimelineEventType,
  title: string,
  description?: string
) {
  const now = new Date();

  await prisma.$transaction([
    prisma.timelineEvent.create({
      data: { candidateId, type, title, description },
    }),
    prisma.candidate.update({
      where: { id: candidateId },
      data: { lastActivityAt: now },
    }),
  ]);
}

export async function createJobOpening(formData: FormData) {
  await requireAuth();

  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const skills = String(formData.get("skills") || "").trim();
  const status = (formData.get("status") as JobStatus) || "OPEN";

  if (!title || !description) {
    return { error: "Title and description are required." };
  }

  await prisma.jobOpening.create({
    data: { title, description, skills, status },
  });

  revalidatePath("/jobs");
  return { success: true };
}

export async function updateJobStatus(jobId: string, status: JobStatus) {
  await requireAuth();

  const job = await prisma.jobOpening.findUnique({ where: { id: jobId } });
  if (!job) return { error: "Job opening not found." };

  await prisma.jobOpening.update({
    where: { id: jobId },
    data: { status },
  });

  revalidatePath("/jobs");
  revalidatePath(`/jobs/${jobId}`);
  return { success: true };
}

export async function createCandidate(formData: FormData) {
  await requireAuth();

  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const jobOpeningId = String(formData.get("jobOpeningId") || "");
  const resume = formData.get("resume") as File | null;

  if (!name || !email || !jobOpeningId) {
    return { error: "Name, email, and job opening are required." };
  }

  const job = await prisma.jobOpening.findUnique({ where: { id: jobOpeningId } });
  if (!job) return { error: "Job opening not found." };
  if (job.status === "CLOSED") {
    return { error: "Cannot add candidates to a closed opening." };
  }

  if (!resume || resume.size === 0) {
    return { error: "Resume PDF is required." };
  }
  if (resume.type !== "application/pdf") {
    return { error: "Resume must be a PDF file." };
  }
  if (resume.size > 10 * 1024 * 1024) {
    return { error: "Resume must be under 10 MB." };
  }

  const existingCandidate = await prisma.candidate.findUnique({
    where: { email },
    select: { id: true },
  });
  if (existingCandidate) {
    return { error: "A candidate with this email already exists." };
  }

  const buffer = Buffer.from(await resume.arrayBuffer());
  const filename = `${randomUUID()}-${resume.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;

  let storagePath: string | undefined;

  try {
    storagePath = await uploadFile("resumes", filename, buffer);

    const candidate = await prisma.candidate.create({
      data: {
        name,
        email,
        jobOpeningId,
        status: "APPLIED",
      },
    });

    await prisma.document.create({
      data: {
        candidateId: candidate.id,
        type: "RESUME",
        filename: resume.name,
        path: storagePath,
        fileSize: buffer.length,
        mimeType: "application/pdf",
      },
    });

    const token = randomUUID();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + MAGIC_LINK_EXPIRY_DAYS);

    await prisma.magicLink.create({
      data: { token, candidateId: candidate.id, expiresAt },
    });

    await addTimelineEvent(
      candidate.id,
      "APPLIED",
      "Candidate added",
      `Resume uploaded and application link generated for ${job.title}.`
    );

    revalidatePath("/dashboard");
    revalidatePath("/jobs");

    const baseUrl = await getPublicAppUrl();
    return {
      success: true,
      candidateId: candidate.id,
      magicLink: `${baseUrl}/apply/${token}`,
    };
  } catch (error) {
    if (storagePath) {
      await removeFiles("resumes", [storagePath]).catch(() => {});
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return { error: "A candidate with this email already exists." };
    }

    throw error;
  }
}

export async function submitApplication(token: string, formData: FormData) {
  const magicLink = await prisma.magicLink.findUnique({
    where: { token },
    include: { candidate: true },
  });

  if (!magicLink) return { error: "invalid" };
  if (magicLink.isUsed) return { error: "used" };
  if (new Date() > magicLink.expiresAt) return { error: "expired" };

  const phone = String(formData.get("phone") || "").trim();
  const location = String(formData.get("location") || "").trim();
  const currentRole = String(formData.get("currentRole") || "").trim();
  const noticePeriod = String(formData.get("noticePeriod") || "").trim();
  const salaryExpectationRaw = String(formData.get("salaryExpectation") || "").trim();
  const salaryMatch = salaryExpectationRaw.replace(/,/g, "").match(/\d+(\.\d+)?/);
  const salaryExpectation = salaryMatch ? parseFloat(salaryMatch[0]) : null;
  const linkedInUrl = String(formData.get("linkedInUrl") || "").trim();

  if (!phone || !location || !currentRole || !noticePeriod || !salaryExpectationRaw) {
    return { error: "Please fill in all required fields." };
  }

  if (salaryExpectation === null) {
    return { error: "Please enter a valid salary expectation." };
  }

  await prisma.$transaction([
    prisma.candidate.update({
      where: { id: magicLink.candidateId },
      data: {
        phone,
        location,
        currentRole,
        noticePeriod,
        salaryExpectation,
        salaryCurrency: "USD",
        linkedInUrl: linkedInUrl || null,
        status: "FORM_SUBMITTED",
        lastActivityAt: new Date(),
      },
    }),
    prisma.magicLink.update({
      where: { id: magicLink.id },
      data: { isUsed: true },
    }),
    prisma.timelineEvent.create({
      data: {
        candidateId: magicLink.candidateId,
        type: "FORM_SUBMITTED",
        title: "Application form submitted",
        description: "Candidate completed their application details.",
      },
    }),
  ]);

  revalidatePath(`/candidates/${magicLink.candidateId}`);
  revalidatePath("/dashboard");
  return { success: true };
}

export async function scheduleInterview(candidateId: string, formData: FormData) {
  await requireAuth();

  const date = String(formData.get("date") || "");
  const time = String(formData.get("time") || "").trim();
  const type = formData.get("type") as InterviewType;
  const interviewerName = String(formData.get("interviewerName") || "").trim();
  const notes = String(formData.get("notes") || "").trim();

  if (!date || !time || !interviewerName || !type) {
    return { error: "Date, time, interviewer, and type are required." };
  }

  const candidate = await prisma.candidate.findUnique({ where: { id: candidateId } });
  if (!candidate) return { error: "Candidate not found." };

  if (
    candidate.status === "OFFER_SENT" ||
    candidate.status === "HIRED" ||
    candidate.status === "REJECTED"
  ) {
    return { error: "Interviews can only be scheduled before an offer is sent." };
  }

  const scheduledAt = new Date(date);
  const [hours, minutes] = time.split(":").map(Number);
  scheduledAt.setHours(hours, minutes, 0, 0);

  await prisma.interview.create({
    data: {
      candidateId,
      scheduledAt,
      type,
      interviewerName,
      notes: notes || null,
    },
  });

  await prisma.candidate.update({
    where: { id: candidateId },
    data: { status: "INTERVIEW_SCHEDULED" },
  });

  await addTimelineEvent(
    candidateId,
    "INTERVIEW_SCHEDULED",
    `${type === "SCREENING" ? "Screening" : "Technical"} interview scheduled`,
    `${interviewerName} · ${date} at ${time}${notes ? ` — ${notes}` : ""}`
  );

  revalidatePath(`/candidates/${candidateId}`);
  revalidatePath("/interviews");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function completeInterview(interviewId: string, formData: FormData) {
  await requireAuth();

  const recommendation = formData.get("recommendation") as FeedbackRecommendation;
  const feedbackNote = String(formData.get("feedbackNote") || "").trim();

  if (!recommendation) {
    return { error: "Recommendation is required." };
  }

  const interview = await prisma.interview.findUnique({
    where: { id: interviewId },
    include: { candidate: true },
  });
  if (!interview) return { error: "Interview not found." };

  await prisma.interview.update({
    where: { id: interviewId },
    data: {
      status: "COMPLETED",
      feedbackRecommendation: recommendation,
      feedbackNote: feedbackNote || null,
      completedAt: new Date(),
    },
  });
  const RECOMMENDATION_LABELS = {
    HIRE: "Hire",
    MAYBE: "Maybe",
    NO_HIRE: "No Hire",
  } as const;
  const recLabel =
  RECOMMENDATION_LABELS[recommendation];

  await addTimelineEvent(
    interview.candidateId,
    "INTERVIEW_COMPLETED",
    "Interview feedback recorded",
    `${recLabel}${feedbackNote ? ` — ${feedbackNote}` : ""}`
  );

  revalidatePath(`/candidates/${interview.candidateId}`);
  revalidatePath("/interviews");
  return { success: true };
}

export async function generateOfferDocuments(candidateId: string, formData: FormData) {
  await requireAuth();

  const roleTitle = String(formData.get("roleTitle") || "").trim();
  const salaryCurrency = String(formData.get("salaryCurrency") || "USD").trim();
  const salaryAmount = parseFloat(String(formData.get("salaryAmount") || "0"));
  const startDate = String(formData.get("startDate") || "");
  const reportingManager = String(formData.get("reportingManager") || "").trim();
  const location = String(formData.get("location") || "").trim();

  if (!roleTitle || !salaryAmount || !startDate || !reportingManager || !location) {
    return { error: "All offer fields are required." };
  }

  const candidate = await prisma.candidate.findUnique({ where: { id: candidateId } });
  if (!candidate) return { error: "Candidate not found." };

  const allowed: CandidateStatus[] = [
    "INTERVIEW_SCHEDULED",
    "OFFER_SENT",
    "FORM_SUBMITTED",
  ];
  if (!allowed.includes(candidate.status) && candidate.status !== "HIRED") {
    const hasCompletedInterview = await prisma.interview.findFirst({
      where: { candidateId, status: "COMPLETED" },
    });
    if (!hasCompletedInterview && candidate.status === "APPLIED") {
      return { error: "Schedule and complete an interview first, or move candidate forward." };
    }
  }

  const offerBytes = await generateOfferLetterPdf({
    candidateName: candidate.name,
    roleTitle,
    salaryAmount,
    salaryCurrency,
    startDate: new Date(startDate),
    reportingManager,
    location,
  });

  const ndaBytes = await generateNDAPdf({ candidateName: candidate.name });

  const offerFilename = `offer-letter-${candidate.name.replace(/\s+/g, "-").toLowerCase()}.pdf`;
  const ndaFilename = `nda-${candidate.name.replace(/\s+/g, "-").toLowerCase()}.pdf`;

  const existingDocs = await prisma.document.findMany({
    where: { candidateId, type: { in: ["OFFER_LETTER", "NDA"] } },
    select: { path: true, type: true },
  });

  let offerPath: string;
  let ndaPath: string;

  try {
    offerPath = await uploadFile(
      "offers",
      `${randomUUID()}-${offerFilename}`,
      Buffer.from(offerBytes)
    );
    ndaPath = await uploadFile(
      "nda",
      `${randomUUID()}-${ndaFilename}`,
      Buffer.from(ndaBytes)
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to upload offer documents to storage.";
    return { error: message };
  }

  await prisma.$transaction([
    prisma.offerDetails.upsert({
      where: { candidateId },
      create: {
        candidateId,
        roleTitle,
        salaryCurrency,
        salaryAmount,
        startDate: new Date(startDate),
        reportingManager,
        location,
      },
      update: {
        roleTitle,
        salaryCurrency,
        salaryAmount,
        startDate: new Date(startDate),
        reportingManager,
        location,
      },
    }),
    prisma.document.deleteMany({
      where: { candidateId, type: { in: ["OFFER_LETTER", "NDA"] } },
    }),
    prisma.document.create({
      data: {
        candidateId,
        type: "OFFER_LETTER",
        filename: offerFilename,
        path: offerPath,
        fileSize: offerBytes.length,
        mimeType: "application/pdf",
      },
    }),
    prisma.document.create({
      data: {
        candidateId,
        type: "NDA",
        filename: ndaFilename,
        path: ndaPath,
        fileSize: ndaBytes.length,
        mimeType: "application/pdf",
      },
    }),
    prisma.candidate.update({
      where: { id: candidateId },
      data: { status: "OFFER_SENT", lastActivityAt: new Date() },
    }),
    prisma.timelineEvent.create({
      data: {
        candidateId,
        type: "OFFER_GENERATED",
        title: "Offer documents generated",
        description: `Offer letter and NDA created for ${roleTitle} at ${salaryCurrency} ${salaryAmount.toLocaleString()}.`,
      },
    }),
  ]);

  if (existingDocs.length > 0) {
    await removeDocumentFiles(existingDocs);
  }

  revalidatePath(`/candidates/${candidateId}`);
  revalidatePath("/dashboard");
  return { success: true };
}

export async function markCandidateHired(candidateId: string) {
  await requireAuth();

  const candidate = await prisma.candidate.findUnique({
    where: { id: candidateId },
    include: { documents: true },
  });
  if (!candidate) return { error: "Candidate not found." };
  if (candidate.status === "HIRED") return { error: "Already hired." };
  if (candidate.status === "REJECTED") return { error: "Cannot hire a rejected candidate." };

  const hasOffer = candidate.documents.some((d) => d.type === "OFFER_LETTER");
  if (!hasOffer) return { error: "Generate an offer letter before marking as hired." };

  await prisma.candidate.update({
    where: { id: candidateId },
    data: { status: "HIRED" },
  });

  await addTimelineEvent(candidateId, "HIRED", "Candidate hired", "Offer accepted — welcome to ROVE!");

  revalidatePath(`/candidates/${candidateId}`);
  revalidatePath("/dashboard");
  return { success: true };
}

export async function markCandidateRejected(candidateId: string, formData: FormData) {
  await requireAuth();

  const reason = String(formData.get("reason") || "").trim();
  if (!reason) return { error: "Rejection reason is required." };

  const candidate = await prisma.candidate.findUnique({ where: { id: candidateId } });
  if (!candidate) return { error: "Candidate not found." };
  if (candidate.status === "HIRED") return { error: "Cannot reject a hired candidate." };
  if (candidate.status === "REJECTED") return { error: "Already rejected." };

  await prisma.candidate.update({
    where: { id: candidateId },
    data: { status: "REJECTED", rejectionReason: reason },
  });

  await addTimelineEvent(candidateId, "REJECTED", "Candidate rejected", reason);

  revalidatePath(`/candidates/${candidateId}`);
  revalidatePath("/dashboard");
  return { success: true };
}

export async function regenerateMagicLink(candidateId: string) {
  await requireAuth();

  const candidate = await prisma.candidate.findUnique({ where: { id: candidateId } });
  if (!candidate) return { error: "Candidate not found." };
  if (candidate.status !== "APPLIED") {
    return { error: "Magic links are only available for Applied candidates." };
  }

  const token = randomUUID();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + MAGIC_LINK_EXPIRY_DAYS);

  await prisma.magicLink.create({
    data: { token, candidateId, expiresAt },
  });

  const baseUrl = await getPublicAppUrl();
  return { success: true, magicLink: `${baseUrl}/apply/${token}` };
}
