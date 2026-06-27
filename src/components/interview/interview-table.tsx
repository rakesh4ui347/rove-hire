import { CandidateStatus, InterviewStatus } from "@prisma/client";

import { Card } from "@/components/ui/card";

import { InterviewRow } from "./interview-row";

type Interview = {
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

interface InterviewTableProps {
  interviews: Interview[];
}

export function InterviewTable({
  interviews,
}: InterviewTableProps) {
  return (
    <Card className="overflow-hidden">
      <table className="w-full table-fixed text-left text-sm">
        <thead className="border-b border-border bg-gray-50/80 text-xs uppercase tracking-wide text-gray-600">
          <tr>
            <th className="px-6 py-3 font-medium">Date</th>
            <th className="px-6 py-3 font-medium">Candidate</th>
            <th className="px-6 py-3 font-medium">Type</th>
            <th className="px-6 py-3 font-medium">Interviewer</th>
            <th className="px-6 py-3 font-medium">Status</th>
            <th className="px-6 py-3 font-medium">Pipeline</th>
          </tr>
        </thead>

        <tbody>
          {interviews.map((interview) => (
            <InterviewRow key={interview.id} interview={interview} />
          ))}
        </tbody>
      </table>
    </Card>
  );
}
