import Link from "next/link";
import { Download } from "lucide-react";

import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { InfoItem } from "@/components/ui/info-item";
import { formatCurrency } from "@/lib/utils";
type DocumentItem = {
  id: string;
  filename: string;
};

type CandidateInfo = {
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