import Link from "next/link";
import { MarkdownContent } from "@/components/ui/markdown-content";
import { notFound } from "next/navigation";
import { CalendarDays, Users } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/card";
import { PageBack } from "@/components/ui/page-back";
import { JobCandidatesTable } from "@/components/job/job-candidates-table";
import { JobStatusActions } from "@/components/job/job-status-actions";
import { JobStatusBadge } from "@/components/job/job-status-badge";

interface JobPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function JobPage({ params }: JobPageProps) {
  const { id } = await params;

  const job = await prisma.jobOpening.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      description: true,
      skills: true,
      status: true,
      createdAt: true,
      candidates: {
        select: {
          id: true,
          name: true,
          email: true,
          status: true,
          lastActivityAt: true,
        },
        orderBy: {
          lastActivityAt: "desc",
        },
      },
    },
  });

  if (!job) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <header>
        <PageBack href="/jobs" label="Back to jobs" />

        <div className="mt-3 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">
              {job.title}
            </h1>
            <JobStatusBadge status={job.status} />
          </div>
          <JobStatusActions jobId={job.id} status={job.status} />
        </div>

        <MarkdownContent content={job.description} className="mt-1 text-sm" />

        <div className="mt-4 flex flex-wrap gap-2">
          {job.skills.split(",").map((skill) => (
            <span
              key={skill}
              className="rounded-full border border-border bg-gray-50 px-3 py-1 text-xs font-medium text-gray-700"
            >
              {skill.trim()}
            </span>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-6 text-sm text-muted">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="font-semibold">{job.candidates.length}</span>
            <span>Candidates</span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            {formatDate(job.createdAt)}
          </div>
        </div>
      </header>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Candidates</h2>
          {job.status === "OPEN" && (
            <Link href="/candidates/new">
              <Button size="sm">Add Candidate</Button>
            </Link>
          )}
        </div>

        {job.candidates.length === 0 ? (
          <EmptyState
            title="No candidates yet"
            description={
              job.status === "OPEN"
                ? "Add a candidate to start tracking applications for this role."
                : "This job is closed. Reopen it to add new candidates."
            }
            action={
              job.status === "OPEN" ? (
                <Link href="/candidates/new">
                  <Button>Add Candidate</Button>
                </Link>
              ) : undefined
            }
          />
        ) : (
          <JobCandidatesTable candidates={job.candidates} />
        )}
      </section>
    </div>
  );
}
