import { Card, CardBody } from "@/components/ui/card";
import { MarkdownContent } from "@/components/ui/markdown-content";
import { formatDate } from "@/lib/utils";
import { JobStatusBadge } from "./job-status-badge";
import { Briefcase,  CalendarDays, Users } from "lucide-react";
import Link from "next/link";

type JobCardProps = {
  job: {
    id: string;
    title: string;
    description: string;
    skills: string;
    status: "OPEN" | "CLOSED";
    createdAt: Date;
    _count: {
      candidates: number;
    };
  };
};

export function JobCard({
  job,
}: JobCardProps) {
  return (
    <Link href={`/jobs/${job.id}`} className="block">
      <Card className="transition-all hover:border-accent/40 hover:shadow-md">
        <CardBody className="space-y-5 p-6 gap-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-accent/10 p-2 text-accent">
                <Briefcase className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-xl font-semibold">
                  {job.title}
                </h2>
              </div>
            </div>

            <JobStatusBadge status={job.status} />

          </div>

          <MarkdownContent
            content={job.description}
            className="max-w-5xl line-clamp-3 text-sm"
          />

          <div className="flex flex-wrap gap-2">
            {job.skills
              .split(",")
              .map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-border bg-gray-50 px-3 py-1 text-xs font-medium text-gray-700"
                >
                  {skill.trim()}
                </span>
              ))}
          </div>

          <div className="flex items-center gap-6 text-sm text-muted">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="font-semibold">
  {job._count.candidates}
</span>

<span className="text-muted">
  Candidates
</span>
            </div>

            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              {formatDate(job.createdAt)}
            </div>
          </div>
        </CardBody>
      </Card>
    </Link>
  );
}