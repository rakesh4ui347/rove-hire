"use client";

import { useRouter } from "next/navigation";
import { CandidateStatus } from "@prisma/client";

import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDate } from "@/lib/utils";

type JobCandidate = {
  id: string;
  name: string;
  email: string;
  status: CandidateStatus;
  updatedAt: Date;
};

interface JobCandidatesTableProps {
  candidates: JobCandidate[];
}

export function JobCandidatesTable({
  candidates,
}: JobCandidatesTableProps) {
  const router = useRouter();

  return (
    <Card className="overflow-hidden">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-border bg-gray-50/80 text-xs uppercase tracking-wide text-gray-600">
          <tr>
            <th className="px-6 py-3 font-medium">Candidate</th>
            <th className="px-6 py-3 font-medium">Email</th>
            <th className="px-6 py-3 font-medium">Status</th>
            <th className="px-6 py-3 font-medium">Last Activity</th>
          </tr>
        </thead>

        <tbody>
          {candidates.map((candidate) => (
            <tr
              key={candidate.id}
              onClick={() => router.push(`/candidates/${candidate.id}`)}
              className="cursor-pointer border-b border-border transition-colors duration-150 last:border-0 hover:bg-gray-50"
            >
              <td className="px-6 py-4 font-semibold text-gray-900">
                {candidate.name}
              </td>
              <td className="px-6 py-4 text-muted">{candidate.email}</td>
              <td className="px-6 py-4">
                <StatusBadge status={candidate.status} />
              </td>
              <td className="px-6 py-4 text-muted">
                {formatDate(candidate.updatedAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
