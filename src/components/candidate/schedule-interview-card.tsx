"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { ActionPanel } from "./action-panel";

interface ScheduleInterviewCardProps {
  hidden?: boolean;
  loading: string;
  onSubmit: (formData: FormData) => Promise<void>;
}

const INTERVIEW_TYPES = [
  {
    value: "SCREENING",
    label: "Screening",
  },
  {
    value: "TECHNICAL",
    label: "Technical",
  },
];

export function ScheduleInterviewCard({
  hidden = false,
  loading,
  onSubmit,
}: ScheduleInterviewCardProps) {
  if (hidden) {
    return null;
  }

  const isSubmitting = loading === "schedule";

  return (
    <ActionPanel
      title="Schedule Interview"
      description="Schedule the next interview with the candidate."
    >
      <form
        action={onSubmit}
        className="space-y-4"
      >
        <Input
          name="date"
          type="date"
          required
        />

        <Input
          name="time"
          type="time"
          required
        />

        <Select
          name="type"
          defaultValue="SCREENING"
          required
        >
          {INTERVIEW_TYPES.map((type) => (
            <option
              key={type.value}
              value={type.value}
            >
              {type.label}
            </option>
          ))}
        </Select>

        <Input
          name="interviewerName"
          placeholder="Interviewer Name"
          required
        />

        <Textarea
          name="notes"
          placeholder="Interview notes (optional)"
          className="min-h-[80px]"
        />

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Scheduling..."
            : "Schedule Interview"}
        </Button>
      </form>
    </ActionPanel>
  );
}