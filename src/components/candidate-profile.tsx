"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import {
  completeInterview,
  generateOfferDocuments,
  markCandidateHired,
  markCandidateRejected,
  regenerateMagicLink,
  scheduleInterview,
} from "@/lib/actions";

import { CandidateStatus, DocumentType, Interview, TimelineEvent } from "@prisma/client";

import { CandidateInfoCard } from "./candidate/candidate-info-card";
import { TimelineCard } from "./candidate/timeline-card";
import { InterviewCard } from "./candidate/interview-card";
import { DocumentsCard } from "./candidate/documents-card";
import { MagicLinkCard } from "./candidate/magic-link-card";
import { ScheduleInterviewCard } from "./candidate/schedule-interview-card";
import { OfferForm } from "./candidate/offer-form";
import { CandidateActionsCard } from "./candidate/candidate-actions-card";

import { ActionResult } from "@/types/action-result";

type DocumentItem = {
  id: string;
  type: DocumentType;
  filename: string;
};

type CandidateData = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  location: string | null;
  currentRole: string | null;
  noticePeriod: string | null;
  salaryExpectation: number | null;
  salaryCurrency: string | null;
  linkedInUrl: string | null;
  status: CandidateStatus;
  rejectionReason: string | null;
  jobOpening: {
    title: string;
  };
  interviews: Interview[];
  timelineEvents: TimelineEvent[];
  documents: DocumentItem[];
};

interface CandidateProfileProps {
  candidate: CandidateData;
  initialMagicLink?: string | null;
}

export function CandidateProfile({
  candidate,
  initialMagicLink = "",
}: CandidateProfileProps) {
  const router = useRouter();

  const [loading, setLoading] = useState("");

  const [magicLink, setMagicLink] = useState(initialMagicLink ?? "");
  const [copied, setCopied] = useState(false);

  const [showOfferForm, setShowOfferForm] = useState(false);
  const [showRejectForm, setShowRejectForm] = useState(false);

  const resume = candidate.documents.find((doc) => doc.type === "RESUME");

  const generatedDocuments = candidate.documents.filter((doc) =>
    ["OFFER_LETTER", "NDA"].includes(doc.type)
  );

  const offerLetter = candidate.documents.find(
    (doc) => doc.type === "OFFER_LETTER"
  );

  const hasCompletedInterview = candidate.interviews.some(
    (interview) => interview.status === "COMPLETED"
  );

  const isTerminal =
    candidate.status === "HIRED" || candidate.status === "REJECTED";

  const canScheduleInterview =
    candidate.status === "APPLIED" ||
    candidate.status === "FORM_SUBMITTED" ||
    candidate.status === "INTERVIEW_SCHEDULED";

  const canManageOffer =
    !isTerminal &&
    (hasCompletedInterview ||
      candidate.status === "INTERVIEW_SCHEDULED" ||
      candidate.status === "OFFER_SENT");

  async function runAction(
    key: string,
    action: () => Promise<ActionResult>,
    successMessage?: string,
    onSuccess?: () => void
  ): Promise<boolean> {
    setLoading(key);

    try {
      const result = await action();

      if (result.error) {
        toast.error(result.error);
        return false;
      }

      if (successMessage) {
        toast.success(successMessage);
      }

      onSuccess?.();
      router.refresh();
      return true;
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
      return false;
    } finally {
      setLoading("");
    }
  }

  const handleCompleteInterview = (
    interviewId: string,
    formData: FormData
  ) =>
    runAction(
      `feedback-${interviewId}`,
      () => completeInterview(interviewId, formData),
      "Interview marked as completed."
    );

  const handleScheduleInterview = (formData: FormData) =>
    runAction(
      "schedule",
      () => scheduleInterview(candidate.id, formData),
      "Interview scheduled successfully."
    );

  const handleGenerateOffer = async (formData: FormData) => {
    await runAction(
      "offer",
      () => generateOfferDocuments(candidate.id, formData),
      "Offer letter and NDA generated successfully.",
      () => setShowOfferForm(false)
    );
  };

  const handleGenerateMagicLink = () =>
    runAction("magic", async () => {
      const result = await regenerateMagicLink(candidate.id);

      if (result.magicLink) {
        setMagicLink(result.magicLink);
      }

      return result;
    }, "New application link generated.");

  const handleHire = () =>
    runAction(
      "hire",
      () => markCandidateHired(candidate.id),
      "Candidate marked as hired."
    );

  const handleReject = (formData: FormData) =>
    runAction(
      "reject",
      () => markCandidateRejected(candidate.id, formData),
      "Candidate marked as rejected.",
      () => setShowRejectForm(false)
    );

  const handleCopyMagicLink = async () => {
    if (!magicLink) return;

    try {
      await navigator.clipboard.writeText(magicLink);
      setCopied(true);
      toast.success("Application link copied to clipboard.");

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      toast.error("Unable to copy the application link.");
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <CandidateInfoCard candidate={candidate} resume={resume} />

        <TimelineCard events={candidate.timelineEvents} />

        {!!candidate.interviews.length && (
          <InterviewCard
            interviews={candidate.interviews}
            loading={loading}
            onCompleteInterview={handleCompleteInterview}
          />
        )}

        {!!generatedDocuments.length && (
          <DocumentsCard documents={generatedDocuments} />
        )}
      </div>

      <div className="space-y-6">
        <MagicLinkCard
          candidateStatus={candidate.status}
          loading={loading}
          magicLink={magicLink}
          copied={copied}
          onCopy={handleCopyMagicLink}
          onGenerate={handleGenerateMagicLink}
        />

        <ScheduleInterviewCard
          hidden={!canScheduleInterview}
          loading={loading}
          onSubmit={handleScheduleInterview}
        />

        <OfferForm
          candidate={candidate}
          offerGenerated={Boolean(offerLetter)}
          visible={showOfferForm}
          loading={loading}
          hidden={!canManageOffer}
          onToggle={setShowOfferForm}
          onSubmit={handleGenerateOffer}
        />

        <CandidateActionsCard
          candidate={candidate}
          offerGenerated={Boolean(offerLetter)}
          showRejectForm={showRejectForm}
          loading={loading}
          onToggleReject={setShowRejectForm}
          onHire={handleHire}
          onReject={handleReject}
        />
      </div>
    </div>
  );
}
