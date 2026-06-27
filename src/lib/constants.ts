import { CandidateStatus } from "@prisma/client";

export const CANDIDATE_STATUS_LABELS: Record<CandidateStatus, string> = {
  APPLIED: "Applied",
  FORM_SUBMITTED: "Form Submitted",
  INTERVIEW_SCHEDULED: "Interview Scheduled",
  OFFER_SENT: "Offer Sent",
  HIRED: "Hired",
  REJECTED: "Rejected",
};

export const TERMINAL_STATUSES: CandidateStatus[] = ["HIRED", "REJECTED"];

export const STATUS_FILTER_OPTIONS = Object.entries(CANDIDATE_STATUS_LABELS).map(
  ([value, label]) => ({ value, label })
);

export const HR_TEST_CREDENTIALS = {
  email: "hr@rove.com",
  password: "RoveHire2024!",
};

export const CANDIDATE_STATUS_OPTIONS = [
  { value: "ALL", label: "All statuses" },
  { value: CandidateStatus.APPLIED, label: "Applied" },
  { value: CandidateStatus.FORM_SUBMITTED, label: "Form Submitted" },
  { value: CandidateStatus.INTERVIEW_SCHEDULED, label: "Interview Scheduled" },
  { value: CandidateStatus.OFFER_SENT, label: "Offer Sent" },
  { value: CandidateStatus.HIRED, label: "Hired" },
  { value: CandidateStatus.REJECTED, label: "Rejected" },
] as const;
export const MAGIC_LINK_EXPIRY_DAYS = 14;
