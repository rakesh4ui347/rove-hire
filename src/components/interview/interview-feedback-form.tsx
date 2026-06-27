import { FormEvent } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface InterviewFeedbackFormProps {
  interviewId: string;
  loading: string;
  onSubmit: (
    interviewId: string,
    formData: FormData
  ) => Promise<boolean>;
}

const OPTIONS = [
  {
    value: "",
    label: "Select recommendation",
    disabled: true,
  },
  {
    value: "HIRE",
    label: "Hire",
  },
  {
    value: "MAYBE",
    label: "Maybe",
  },
  {
    value: "NO_HIRE",
    label: "No Hire",
  },
];

export function InterviewFeedbackForm({
  interviewId,
  loading,
  onSubmit,
}: InterviewFeedbackFormProps) {
  const isSubmitting =
    loading === `feedback-${interviewId}`;

  return (
    <form
      onSubmit={async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        const success = await onSubmit(
          interviewId,
          new FormData(form)
        );
        if (success) {
          form.reset();
        }
      }}
      className="mt-4 space-y-3 border-t border-border pt-4"
    >
      <Select
        name="recommendation"
        defaultValue=""
        required
      >
        {OPTIONS.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </Select>

      <Textarea
        name="feedbackNote"
        placeholder="Feedback notes (optional)"
      />

      <Button
        type="submit"
        size="sm"
        disabled={isSubmitting}
      >
        {isSubmitting && (
          <Loader2 className="h-4 w-4 animate-spin" />
        )}
        {isSubmitting ? "Saving..." : "Mark Completed"}
      </Button>
    </form>
  );
}