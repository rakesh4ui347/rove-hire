"use client";

import Link from "next/link";
import { CandidateStatus } from "@prisma/client";

import { StatusBadge } from "@/components/ui/status-badge";
import { formatDate } from "@/lib/utils";

type CandidateRowProps = {
  candidate: {
    id: string;
    name: string;
    status: CandidateStatus;
    updatedAt: Date;
    jobOpening: {
      title: string;
    };
  };
};

export function CandidateRow({ candidate }: CandidateRowProps) {
  return (
    <tr className="border-b border-border last:border-0">
      <td colSpan={4} className="p-0">
        <Link
          href={`/candidates/${candidate.id}`}
          className="grid grid-cols-4 items-center px-6 py-4 text-sm transition-colors hover:bg-gray-50"
        >
          <span className="font-semibold text-gray-900">
            {candidate.name}
          </span>

          <span className="text-muted">{candidate.jobOpening.title}</span>

          <span>
            <StatusBadge status={candidate.status} />
          </span>

          <span className="text-muted">{formatDate(candidate.updatedAt)}</span>
        </Link>
      </td>
    </tr>
  );
}
