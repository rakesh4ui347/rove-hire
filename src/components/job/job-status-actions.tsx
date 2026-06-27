"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
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

  const isOpen = status === "OPEN";
  const nextStatus: JobStatus = isOpen ? "CLOSED" : "OPEN";

  async function handleToggle() {
    setLoading(true);

    try {
      const result = await updateJobStatus(jobId, nextStatus);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success(isOpen ? "Job closed successfully." : "Job reopened successfully.");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      variant={isOpen ? "secondary" : "primary"}
      size="sm"
      disabled={loading}
      onClick={handleToggle}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {loading
        ? isOpen
          ? "Closing..."
          : "Reopening..."
        : isOpen
          ? "Close Job"
          : "Reopen Job"}
    </Button>
  );
}
