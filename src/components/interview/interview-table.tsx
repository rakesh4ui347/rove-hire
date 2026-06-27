import { CandidateStatus, InterviewStatus } from "@prisma/client";

import { Card, CardBody, CardHeader } from "@/components/ui/card";

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
      <CardHeader
        title="Interviews"
        description={`${interviews.length} interviews`}
      />
      <CardBody className="p-0">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-border bg-gray-50/80 text-xs uppercase tracking-wide text-gray-600">
          <tr>
            <th className="px-6 py-3 font-medium">
              Date
            </th>

            <th className="px-6 py-3 font-medium">
              Candidate
            </th>

            <th className="px-6 py-3 font-medium">
              Type
            </th>

            <th className="px-6 py-3 font-medium">
              Interviewer
            </th>

            <th className="px-6 py-3 font-medium">
              Status
            </th>
          </tr>
        </thead>

        <tbody>
          {interviews.map((interview) => (
            <InterviewRow
              key={interview.id}
              interview={interview}
            />
          ))}
        </tbody>
      </table>
      </CardBody>
    </Card>
  );
}