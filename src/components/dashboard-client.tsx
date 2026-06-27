"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search,  Users,
  CalendarDays,
  FileText,
  BadgeCheck } from "lucide-react";
import { CandidateStatus } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";

import { CandidateTable } from "@/components/candidate/candidate-table";
import { CandidateStatusFilter } from "@/components/candidate/candidate-status-filter";
import { StatCard } from "@/components/ui/stat-card";

type CandidateRow = {
  id: string;
  name: string;
  status: CandidateStatus;
  updatedAt: Date;
  jobOpening: {
    title: string;
  };
};

interface DashboardClientProps {
  candidates: CandidateRow[];
}

export function DashboardClient({
  candidates,
}: DashboardClientProps) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<
    CandidateStatus | "ALL"
  >("ALL");

  const filteredCandidates = useMemo(() => {
    const search = query.trim().toLowerCase();

    return candidates.filter((candidate) => {
      const matchesStatus =
        status === "ALL" ||
        candidate.status === status;

      const matchesSearch =
        !search ||
        candidate.name
          .toLowerCase()
          .includes(search) ||
        candidate.jobOpening.title
          .toLowerCase()
          .includes(search);

      return matchesStatus && matchesSearch;
    });
  }, [candidates, query, status]);
  const stats = {
    candidates: candidates.length,
    interviews: candidates.filter(
      (candidate) =>
        candidate.status === "INTERVIEW_SCHEDULED"
    ).length,
    offers: candidates.filter(
      (candidate) =>
        candidate.status === "OFFER_SENT"
    ).length,
    hired: candidates.filter(
      (candidate) =>
        candidate.status === "HIRED"
    ).length,
  };
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description={`${candidates.length} candidates in pipeline`}
        action={
          <Button>
            <Link href="/candidates/new">
              Add Candidate
            </Link>
          </Button>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Candidates"
          value={stats.candidates}
          icon={<Users className="h-5 w-5" />}
        />

        <StatCard
          title="Interviews"
          value={stats.interviews}
          icon={<CalendarDays className="h-5 w-5" />}
        />

        <StatCard
          title="Offers"
          value={stats.offers}
          icon={<FileText className="h-5 w-5" />}
        />

        <StatCard
          title="Hired"
          value={stats.hired}
          icon={<BadgeCheck className="h-5 w-5" />}
        />
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />

          <Input
            value={query}
            onChange={(e) =>
              setQuery(e.target.value)
            }
            placeholder="Search candidates or roles..."
            className="h-11 pl-9"
          />
        </div>

        <CandidateStatusFilter
          value={status}
          onChange={setStatus}
          className="sm:w-56"
        />
      </div>

      {filteredCandidates.length === 0 ? (
        <EmptyState
          title="No candidates found"
          description="Try changing the search or filters."
          action={
            <Button>
              <Link href="/candidates/new">
                Add Candidate
              </Link>
            </Button>
          }
        />
      ) : (
        <CandidateTable
          candidates={filteredCandidates}
        />
      )}
    </div>
  );
}