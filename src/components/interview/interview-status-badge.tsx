import { InterviewStatus } from "@prisma/client";

const STATUS_CONFIG: Record<
  InterviewStatus,
  {
    label: string;
    className: string;
  }
> = {
  SCHEDULED: {
    label: "Scheduled",
    className: "bg-violet-50 text-violet-700",
  },
  COMPLETED: {
    label: "Completed",
    className: "bg-emerald-50 text-emerald-700",
  },
};

interface InterviewStatusBadgeProps {
  status: InterviewStatus;
}

export function InterviewStatusBadge({
  status,
}: InterviewStatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}