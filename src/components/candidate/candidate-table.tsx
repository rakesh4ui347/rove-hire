"use client";

import { CandidateStatus } from "@prisma/client";

import { Card } from "@/components/ui/card";

import { CandidateRow } from "./candidate-row";

type Candidate = {
  id: string;
  name: string;
  status: CandidateStatus;
  lastActivityAt: Date;
  jobOpening: {
    title: string;
  };
};

interface CandidateTableProps {
  candidates: Candidate[];
}

export function CandidateTable({
  candidates,
}: CandidateTableProps) {
  return (
    <Card className="overflow-hidden">
      <table className="w-full table-fixed text-left text-sm">
        <thead className="border-b border-border bg-gray-50/80 text-xs uppercase tracking-wide text-gray-600">
          <tr>
            <th className="px-6 py-3 font-medium">
              Candidate
            </th>

            <th className="px-6 py-3 font-medium">
              Role
            </th>

            <th className="px-6 py-3 font-medium">
              Status
            </th>

            <th className="px-6 py-3 font-medium">
              Last Activity
            </th>
          </tr>
        </thead>

        <tbody>
          {candidates.map((candidate) => (
            <CandidateRow
              key={candidate.id}
              candidate={candidate}
            />
          ))}
        </tbody>
      </table>
    </Card>
  );
}