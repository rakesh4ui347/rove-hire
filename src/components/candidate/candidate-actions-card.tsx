"use client";

import { CandidateStatus } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ActionPanel } from "./action-panel";

interface CandidateActionsCardProps {
  candidate: {
    id: string;
    status: CandidateStatus;
    rejectionReason: string | null;
  };
  offerGenerated: boolean;
  loading: string;
  showRejectForm: boolean;
  onToggleReject: (show: boolean) => void;
  onHire: () => void;
  onReject: (formData: FormData) => Promise<void>;
}

export function CandidateActionsCard({
  candidate,
  offerGenerated,
  loading,
  showRejectForm,
  onToggleReject,
  onHire,
  onReject,
}: CandidateActionsCardProps) {
  const isTerminal =
    candidate.status === "HIRED" ||
    candidate.status === "REJECTED";

  if (isTerminal) {
    return null;
  }

  return (
    <ActionPanel
      title="Final Decision"
      description="Hire or reject the candidate."
    >
      <Button
        className="w-full"
        disabled={
          loading === "hire" ||
          !offerGenerated
        }
        onClick={onHire}
      >
        {loading === "hire"
          ? "Hiring..."
          : "Mark as Hired"}
      </Button>

      {!offerGenerated && (
        <p className="text-xs text-muted">
          Generate an offer letter before
          hiring.
        </p>
      )}

      {!showRejectForm ? (
        <Button
          variant="danger"
          className="w-full"
          onClick={() =>
            onToggleReject(true)
          }
        >
          Mark as Rejected
        </Button>
      ) : (
        <form
          action={onReject}
          className="space-y-3"
        >
          <Textarea
            name="reason"
            required
            placeholder="Rejection reason..."
          />

          <div className="flex gap-2">
            <Button
              type="submit"
              variant="danger"
              disabled={
                loading === "reject"
              }
            >
              {loading === "reject"
                ? "Rejecting..."
                : "Confirm"}
            </Button>

            <Button
              type="button"
              variant="secondary"
              onClick={() =>
                onToggleReject(false)
              }
            >
              Cancel
            </Button>
          </div>
        </form>
      )}
    </ActionPanel>
  );
}