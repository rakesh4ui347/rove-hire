import { CandidateStatus } from "@prisma/client";
import { cn } from "@/lib/utils";
import { CANDIDATE_STATUS_LABELS } from "@/lib/constants";

const statusStyles: Record<CandidateStatus, string> = {
  APPLIED: "bg-slate-100 text-slate-700 ring-slate-200",
  FORM_SUBMITTED: "bg-blue-50 text-blue-700 ring-blue-100",
  INTERVIEW_SCHEDULED: "bg-violet-50 text-violet-700 ring-violet-100",
  OFFER_SENT: "bg-amber-50 text-amber-800 ring-amber-100",
  HIRED: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  REJECTED: "bg-red-50 text-red-700 ring-red-100",
};

export function StatusBadge({
  status,
  className,
}: {
  status: CandidateStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        statusStyles[status],
        className
      )}
    >
      {CANDIDATE_STATUS_LABELS[status]}
    </span>
  );
}
