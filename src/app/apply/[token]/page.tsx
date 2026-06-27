import { prisma } from "@/lib/prisma";
import { ApplicationForm } from "@/components/application-form";
import { Card, CardBody } from "@/components/ui/card";

export default async function ApplyPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const magicLink = await prisma.magicLink.findUnique({
    where: { token },
    include: {
      candidate: {
        include: { jobOpening: { select: { title: true } } },
      },
    },
  });

  if (!magicLink) {
    return <ExpiredScreen message="This application link is invalid." />;
  }

  if (magicLink.isUsed) {
    return (
      <ExpiredScreen message="This application has already been submitted. Thank you!" />
    );
  }

  if (new Date() > magicLink.expiresAt) {
    return (
      <ExpiredScreen message="This link has expired. Please contact ROVE HR for a new application link." />
    );
  }

  return (
    <ApplicationForm
      token={token}
      candidateName={magicLink.candidate.name}
      jobTitle={magicLink.candidate.jobOpening.title}
    />
  );
}

function ExpiredScreen({ message }: { message: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <Card className="max-w-md w-full text-center">
        <CardBody className="py-12">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-500 text-xl">
            !
          </div>
          <h1 className="text-xl font-semibold">Link unavailable</h1>
          <p className="mt-2 text-sm text-muted">{message}</p>
        </CardBody>
      </Card>
    </div>
  );
}
