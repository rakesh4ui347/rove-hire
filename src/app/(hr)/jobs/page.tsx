import Link from "next/link";

import { prisma } from "@/lib/prisma";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";

import { JobCard } from "@/components/job/job-card";
import {
  Briefcase,
  FolderOpen,
  FolderLock,
  Plus,
  CircleCheckBig,
  Clock3,
} from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";

export default async function JobsPage() {
  const jobs = await prisma.jobOpening.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      skills: true,
      status: true,
      createdAt: true,
      _count: {
        select: {
          candidates: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-8">
      <PageHeader
        title="Job Openings"
        description={`${jobs.length} opening${jobs.length !== 1 ? "s" : ""}`}
        action={
          <Link href="/jobs/new">
            <Button>
              <Plus className="h-4 w-4" />
              New Opening
            </Button>
          </Link>
        }
      />
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard
          title="Total Jobs"
          value={jobs.length}
          icon={<Briefcase className="h-5 w-5" />}
        />

        <StatCard
          title="Open"
          value={jobs.filter((job) => job.status === "OPEN").length}
          icon={<Clock3 className="h-5 w-5" />}
        />

        <StatCard
          title="Closed"
          value={jobs.filter((job) => job.status === "CLOSED").length}
          icon={<CircleCheckBig className="h-5 w-5" />}
        />
      </div>
      {jobs.length === 0 ? (
        <EmptyState
          title="No job openings"
          description="Create your first job opening to start hiring candidates."
          action={
            <Link href="/jobs/new">
              <Button>+ New Opening</Button>
            </Link>
          }
        />
      ) : (
        <div className="flex flex-col gap-6">
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
            />
          ))}
        </div>
      )}
    </div>
  );
}