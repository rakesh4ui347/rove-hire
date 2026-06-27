import { prisma } from "@/lib/prisma";
import { EmptyState } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { InterviewTable } from "@/components/interview/interview-table";
import { StatCard } from "@/components/ui/stat-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  CalendarDays,
  Clock3,
  CircleCheckBig,
} from "lucide-react";

export default async function InterviewsPage() {
  const interviews = await prisma.interview.findMany({
    select: {
      id: true,
      scheduledAt: true,
      type: true,
      interviewerName: true,
      status: true,
      candidateId: true,
      candidate: {
        select: {
          name: true,
          status: true,
          jobOpening: {
            select: {
              title: true,
            },
          },
        },
      },
    },
    orderBy: {
      scheduledAt: "asc",
    },
  });
  const stats = {
    total: interviews.length,
    scheduled: interviews.filter(
      (i) => i.status === "SCHEDULED"
    ).length,
    completed: interviews.filter(
      (i) => i.status === "COMPLETED"
    ).length,
  };
  return (
    <div>
      <PageHeader
        title="Interviews"
        description="Upcoming and past interviews sorted by date"
      />
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard
          title="Total"
          value={stats.total}
          icon={<CalendarDays className="h-5 w-5" />}
        />

        <StatCard
          title="Scheduled"
          value={stats.scheduled}
          icon={<Clock3 className="h-5 w-5" />}
        />

        <StatCard
          title="Completed"
          value={stats.completed}
          icon={<CircleCheckBig className="h-5 w-5" />}
        />
      </div>
      {interviews.length === 0 ? (
        <EmptyState
          title="No interviews scheduled"
          description="Schedule an interview from a candidate profile."
          action={
            <Link href="/dashboard">
              <Button>View Candidates</Button>
            </Link>
          }
        />
      ) : (
        <InterviewTable interviews={interviews} />
      )}
    </div>
  );
}