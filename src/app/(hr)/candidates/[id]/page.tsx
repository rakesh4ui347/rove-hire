import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";

import { CandidateProfile } from "@/components/candidate-profile";
import { StatusBadge } from "@/components/ui/status-badge";
import { PageBack } from "@/components/ui/page-back";

interface CandidatePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CandidatePage({
  params,
}: CandidatePageProps) {
  const { id } = await params;

  const candidate =
    await prisma.candidate.findUnique({
      where: { id },
      include: {
        jobOpening: {
          select: {
            title: true,
          },
        },

        interviews: {
          orderBy: {
            scheduledAt: "desc",
          },
        },

        timelineEvents: {
          orderBy: {
            createdAt: "desc",
          },
        },

        documents: {
          select: {
            id: true,
            filename: true,
            type: true,
            path: true,
            mimeType: true,
            createdAt: true,
          },
        },

        magicLinks: {
          where: {
            isUsed: false,
            expiresAt: {
              gt: new Date(),
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },
    });

  if (!candidate) {
    notFound();
  }

  const activeMagicLink =
    candidate.magicLinks[0]
      ? `${process.env.NEXTAUTH_URL ?? "http://localhost:3000"}/apply/${candidate.magicLinks[0].token}`
      : "";

  const { magicLinks, ...profileCandidate } = candidate;

  return (
    <div className="space-y-8">
      <header>
        <PageBack
          href="/dashboard"
          label="Back to dashboard"
        />

        <div className="mt-3 flex items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">
            {candidate.name}
          </h1>

          <StatusBadge
            status={candidate.status}
          />
        </div>

        <p className="mt-1 text-sm text-muted">
          {candidate.email}
        </p>
      </header>

      <CandidateProfile
        candidate={{
          ...profileCandidate,
          salaryExpectation:
            profileCandidate.salaryExpectation != null
              ? Number(profileCandidate.salaryExpectation)
              : null,
        }}
        initialMagicLink={activeMagicLink}
      />
    </div>
  );
}