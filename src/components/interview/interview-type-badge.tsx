import { InterviewType } from "@prisma/client";

interface InterviewTypeBadgeProps {
  type: InterviewType | string;
}

const styles = {
  SCREENING:
    "bg-slate-100 text-slate-700",
  TECHNICAL:
    "bg-blue-100 text-blue-700",
};

export function InterviewTypeBadge({
  type,
}: InterviewTypeBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${styles[type as InterviewType]}`}
    >
      {type === "SCREENING"
        ? "Screening"
        : "Technical"}
    </span>
  );
}