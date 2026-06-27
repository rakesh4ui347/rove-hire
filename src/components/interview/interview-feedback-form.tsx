import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface InterviewFeedbackFormProps {
  interviewId: string;
  loading: string;
  onSubmit: (
    interviewId: string,
    formData: FormData
  ) => Promise<void>;
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
      action={(formData) =>
        onSubmit(interviewId, formData)
      }
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
        {isSubmitting
          ? "Saving..."
          : "Mark Completed"}
      </Button>
    </form>
  );
}