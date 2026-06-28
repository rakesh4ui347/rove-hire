import Link from "next/link";
import { Download } from "lucide-react";

import { CandidateStatus } from "@prisma/client";

import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { InfoItem } from "@/components/ui/info-item";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatCurrency } from "@/lib/utils";
type DocumentItem = {
  id: string;
  filename: string;
};

type CandidateInfo = {
  status: CandidateStatus;
  rejectionReason: string | null;
  email: string;
  phone: string | null;
  location: string | null;
  currentRole: string | null;
  noticePeriod: string | null;
  salaryExpectation: number | null;
  salaryCurrency: string | null;
  linkedInUrl: string | null;
  jobOpening: {
    title: string;
  };
};

interface CandidateInfoCardProps {
  candidate: CandidateInfo;
  resume?: DocumentItem;
}

export function CandidateInfoCard({
  candidate,
  resume,
}: CandidateInfoCardProps) {
  type InfoField = {
    label: string;
    value: React.ReactNode;
    link?: boolean;
  };

  const infoItems: InfoField[] = [
    {
      label: "Status",
      value: <StatusBadge status={candidate.status} />,
    },
    {
      label: "Email",
      value: candidate.email,
    },
    {
      label: "Phone",
      value: candidate.phone,
    },
    {
      label: "Location",
      value: candidate.location,
    },
    {
      label: "Current Role",
      value: candidate.currentRole,
    },
    {
      label: "Notice Period",
      value: candidate.noticePeriod,
    },
    {
      label: "Salary Expectation",
      value:
        candidate.salaryExpectation != null && candidate.salaryCurrency
          ? formatCurrency(Number(candidate.salaryExpectation), candidate.salaryCurrency)
          : candidate.salaryExpectation,
    },
    {
      label: "Applied For",
      value: candidate.jobOpening.title,
    },
    {
      label: "LinkedIn",
      value: candidate.linkedInUrl,
      link: true,
    },
  ];

  return (
    <Card>
      <CardHeader
        title="Candidate Information"
        description="Personal and application details"
      />

      <CardBody className="space-y-6">
        <dl className="grid gap-6 sm:grid-cols-2">
          {infoItems.map((item) => (
            <InfoItem
              key={item.label}
              {...item}
            />
          ))}
        </dl>

        {candidate.status === "REJECTED" && candidate.rejectionReason && (
          <div className="rounded-lg border border-red-100 bg-red-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-red-700">
              Rejection reason
            </p>
            <p className="mt-2 text-sm leading-6 text-red-900">
              {candidate.rejectionReason}
            </p>
          </div>
        )}

        {resume && (
          <div className="border-t border-border pt-5">
            <Link
              href={`/api/documents/${resume.id}`}
              className="inline-flex items-center gap-2 text-sm font-medium text-accent transition-colors hover:underline"
            >
              <Download className="h-4 w-4" />
              Download Resume
              {resume.filename && ` (${resume.filename})`}
            </Link>
          </div>
        )}
      </CardBody>
    </Card>
  );
}