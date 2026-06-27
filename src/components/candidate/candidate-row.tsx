"use client";

import { useRouter } from "next/navigation";
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

export function CandidateRow({
  candidate,
}: CandidateRowProps) {
  const router = useRouter();

  return (
    <tr
      onClick={() => router.push(`/candidates/${candidate.id}`)}
      className="cursor-pointer border-b border-border transition-colors duration-150 last:border-0 hover:bg-gray-50"
    >
      <td className="px-6 py-4 font-semibold text-gray-900">
        {candidate.name}
      </td>

      <td className="px-6 py-4 text-muted">
        {candidate.jobOpening.title}
      </td>

      <td className="px-6 py-4">
        <StatusBadge status={candidate.status} />
      </td>

      <td className="px-6 py-4 text-muted">
        {formatDate(candidate.updatedAt)}
      </td>
    </tr>
  );
}