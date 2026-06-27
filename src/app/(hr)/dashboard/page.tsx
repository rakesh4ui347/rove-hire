import { prisma } from "@/lib/prisma";
import { DashboardClient } from "@/components/dashboard-client";

export default async function DashboardPage() {
  const candidates = await prisma.candidate.findMany({
    select: {
      id: true,
      name: true,
      status: true,
      updatedAt: true,
      jobOpening: { select: { title: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  return <DashboardClient candidates={candidates} />;
}
