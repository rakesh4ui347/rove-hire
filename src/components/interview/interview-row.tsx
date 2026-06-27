"use client";

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

export function InterviewRow({ interview }: InterviewRowProps) {
  const initials = interview.candidate.name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2);

  return (
    <tr className="border-b border-border last:border-0">
      <td colSpan={6} className="p-0">
        <Link
          href={`/candidates/${interview.candidateId}`}
          className="grid grid-cols-6 items-center px-6 py-4 text-sm transition-colors hover:bg-gray-50"
        >
          <span>
            <span className="block font-medium text-gray-900">
              {formatDate(interview.scheduledAt)}
            </span>
            <span className="block text-xs text-muted">
              {formatTime(interview.scheduledAt)}
            </span>
          </span>

          <span className="flex items-center gap-3 min-w-0">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10 text-sm font-semibold text-accent">
              {initials}
            </span>
            <span className="min-w-0">
              <span className="block truncate font-semibold text-gray-900">
                {interview.candidate.name}
              </span>
              <span className="block truncate text-xs text-muted">
                {interview.candidate.jobOpening.title}
              </span>
            </span>
          </span>

          <span>
            <InterviewTypeBadge type={interview.type} />
          </span>

          <span className="text-muted">{interview.interviewerName}</span>

          <span>
            <InterviewStatusBadge status={interview.status} />
          </span>

          <span>
            <StatusBadge status={interview.candidate.status} />
          </span>
        </Link>
      </td>
    </tr>
  );
}
