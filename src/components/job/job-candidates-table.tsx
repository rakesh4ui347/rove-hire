"use client";

import Link from "next/link";
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
  return (
    <Card className="overflow-hidden">
      <table className="w-full table-fixed text-left text-sm">
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
            <tr key={candidate.id} className="border-b border-border last:border-0">
              <td colSpan={4} className="p-0">
                <Link
                  href={`/candidates/${candidate.id}`}
                  className="grid grid-cols-4 items-center px-6 py-4 text-sm transition-colors hover:bg-gray-50"
                >
                  <span className="font-semibold text-gray-900">
                    {candidate.name}
                  </span>
                  <span className="truncate text-muted">{candidate.email}</span>
                  <span>
                    <StatusBadge status={candidate.status} />
                  </span>
                  <span className="text-muted">
                    {formatDate(candidate.updatedAt)}
                  </span>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
