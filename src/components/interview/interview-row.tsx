import Link from "next/link";
import { CandidateStatus, InterviewStatus } from "@prisma/client";

import { formatDate, formatTime } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/status-badge";

import { InterviewStatusBadge } from "./interview-status-badge";
import { InterviewTypeBadge } from "./interview-type-badge";

type InterviewRowProps = {
  interview: {
    id: string;
    scheduledAt: Date;
    type: string;
    interviewerName: string;
    status: InterviewStatus;
    candidateId: string;
    candidate: {
      name: string;
      status: CandidateStatus;
      jobOpening: {
        title: string;
      };
    };
  };
};

export function InterviewRow({
  interview,
}: InterviewRowProps) {
  const initials =
    interview.candidate.name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2);
  return (
    <tr className="border-b transition-colors hover:bg-muted/40">
      <td className="px-6 py-4">
        <div className="font-medium">
          {formatDate(interview.scheduledAt)}
        </div>

        <div className="text-xs text-muted">
          {formatTime(interview.scheduledAt)}
        </div>
      </td>

      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 font-semibold text-accent">
            {initials}
          </div>

          <div>
            <Link
              href={`/candidates/${interview.candidateId}`}
              className="font-semibold hover:text-accent"
            >
              {interview.candidate.name}
            </Link>

            <p className="text-xs text-muted">
              {interview.candidate.jobOpening.title}
            </p>
          </div>
        </div>
      </td>

      <td className="px-6 py-4">
      <InterviewTypeBadge
          type={interview.type}
        />
      </td>

      <td className="px-6 py-4">
        {interview.interviewerName}
      </td>

      <td className="px-6 py-4">
        <InterviewStatusBadge
          status={interview.status}
        />
      </td>

      <td className="px-6 py-4">
        <StatusBadge
          status={interview.candidate.status}
        />
      </td>
    </tr>
  );
}