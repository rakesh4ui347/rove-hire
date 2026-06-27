"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { JobStatus } from "@prisma/client";

import { updateJobStatus } from "@/lib/actions";
import { Button } from "@/components/ui/button";

interface JobStatusActionsProps {
  jobId: string;
  status: JobStatus;
}

export function JobStatusActions({ jobId, status }: JobStatusActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isOpen = status === "OPEN";
  const nextStatus: JobStatus = isOpen ? "CLOSED" : "OPEN";

  async function handleToggle() {
    setLoading(true);
    setError("");

    const result = await updateJobStatus(jobId, nextStatus);

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    router.refresh();
    setLoading(false);
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <Button
        variant={isOpen ? "secondary" : "primary"}
        size="sm"
        disabled={loading}
        onClick={handleToggle}
      >
        {loading
          ? isOpen
            ? "Closing..."
            : "Reopening..."
          : isOpen
            ? "Close Job"
            : "Reopen Job"}
      </Button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
