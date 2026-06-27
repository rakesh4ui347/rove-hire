import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AddCandidateForm } from "@/components/add-candidate-form";
import { PageBack } from "@/components/ui/page-back";

export default async function NewCandidatePage() {
  const jobs = await prisma.jobOpening.findMany({
    select: { id: true, title: true, status: true },
    orderBy: { title: "asc" },
  });

  return (
    <div>
      <div className="mb-8">
        <PageBack href="/dashboard" label="Back to dashboard" />
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">Add Candidate</h1>
      </div>
      <AddCandidateForm jobs={jobs} />
    </div>
  );
}
