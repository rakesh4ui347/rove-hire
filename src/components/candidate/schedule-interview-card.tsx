"use client";

import { FormEvent } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { ActionPanel } from "./action-panel";

interface ScheduleInterviewCardProps {
  hidden?: boolean;
  loading: string;
  onSubmit: (formData: FormData) => Promise<boolean>;
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
        onSubmit={async (event: FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          const form = event.currentTarget;
          const success = await onSubmit(new FormData(form));
          if (success) {
            form.reset();
          }
        }}
        className="space-y-4"
      >
        <fieldset disabled={isSubmitting} className="space-y-4">
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
          {isSubmitting && (
            <Loader2 className="h-4 w-4 animate-spin" />
          )}
          {isSubmitting ? "Scheduling..." : "Schedule Interview"}
        </Button>
        </fieldset>
      </form>
    </ActionPanel>
  );
}