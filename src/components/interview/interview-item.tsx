import { Interview } from "@prisma/client";

import { formatDateTime } from "@/lib/utils";

import { InterviewStatusBadge } from "./interview-status-badge";
import { InterviewFeedbackForm } from "./interview-feedback-form";

const LABELS = {
  HIRE: "Hire",
  MAYBE: "Maybe",
  NO_HIRE: "No Hire",
} as const;

interface InterviewItemProps {
  interview: Interview;
  loading: string;
  onCompleteInterview: (
    interviewId: string,
    formData: FormData
  ) => Promise<void>;
}

export function InterviewItem({
  interview,
  loading,
  onCompleteInterview,
}: InterviewItemProps) {
  const completed =
    interview.status === "COMPLETED";

  return (
    <div className="rounded-lg border border-border p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-medium capitalize">
            {interview.type.toLowerCase()} Interview
          </p>

          <p className="text-sm text-muted">
            {formatDateTime(interview.scheduledAt)}
            {" • "}
            {interview.interviewerName}
          </p>

          {interview.notes && (
            <p className="mt-2 text-sm text-muted">
              {interview.notes}
            </p>
          )}
        </div>

        <InterviewStatusBadge
          status={interview.status}
        />
      </div>

      {completed &&
        interview.feedbackRecommendation && (
          <div className="mt-4 rounded-lg border border-emerald-100 bg-emerald-50 p-3">
            <p className="text-sm font-medium">
              Recommendation:{" "}
              {
                LABELS[
                  interview.feedbackRecommendation
                ]
              }
            </p>

            {interview.feedbackNote && (
              <p className="mt-1 text-sm text-muted">
                {interview.feedbackNote}
              </p>
            )}
          </div>
        )}

      {!completed && (
        <InterviewFeedbackForm
          interviewId={interview.id}
          loading={loading}
          onSubmit={onCompleteInterview}
        />
      )}
    </div>
  );
}