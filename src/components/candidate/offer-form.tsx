"use client";

import { CandidateStatus } from "@prisma/client";

import { ActionPanel } from "./action-panel";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

interface OfferFormProps {
  candidate: {
    jobOpening: {
      title: string;
    };
    status: CandidateStatus;
  };
  offerGenerated: boolean;
  visible: boolean;
  hidden: boolean;
  loading: string;
  onToggle: (show: boolean) => void;
  onSubmit: (formData: FormData) => Promise<void>;
}

const CURRENCIES = [
  { value: "USD", label: "USD" },
  { value: "EUR", label: "EUR" },
  { value: "GBP", label: "GBP" },
] as const;

export function OfferForm({
  candidate,
  offerGenerated,
  visible,
  hidden,
  loading,
  onToggle,
  onSubmit,
}: OfferFormProps) {
  if (hidden) {
    return null;
  }

  const isSubmitting = loading === "offer";
  const isRegenerate = offerGenerated || candidate.status === "OFFER_SENT";

  return (
    <ActionPanel
      title={isRegenerate ? "Regenerate Offer Documents" : "Offer Documents"}
      description={
        isRegenerate
          ? "Update the offer details and replace the existing offer letter and NDA."
          : "Generate the offer letter and NDA for the candidate."
      }
    >
      {!visible ? (
        <Button
          className="w-full"
          onClick={() => onToggle(true)}
        >
          {isRegenerate ? "Regenerate Offer Documents" : "Generate Offer Documents"}
        </Button>
      ) : (
        <form
          action={onSubmit}
          className="space-y-4"
        >
          <FormField
            label="Role Title"
            htmlFor="roleTitle"
          >
            <Input
              id="roleTitle"
              name="roleTitle"
              defaultValue={candidate.jobOpening.title}
              required
            />
          </FormField>

          <div className="grid grid-cols-3 gap-3">
            <FormField
              label="Currency"
              htmlFor="salaryCurrency"
            >
              <Select
                id="salaryCurrency"
                name="salaryCurrency"
                defaultValue="USD"
              >
                {CURRENCIES.map((currency) => (
                  <option
                    key={currency.value}
                    value={currency.value}
                  >
                    {currency.label}
                  </option>
                ))}
              </Select>
            </FormField>

            <div className="col-span-2">
              <FormField
                label="Salary"
                htmlFor="salaryAmount"
              >
                <Input
                  id="salaryAmount"
                  name="salaryAmount"
                  type="number"
                  placeholder="100000"
                  required
                />
              </FormField>
            </div>
          </div>

          <FormField
            label="Start Date"
            htmlFor="startDate"
          >
            <Input
              id="startDate"
              name="startDate"
              type="date"
              required
            />
          </FormField>

          <FormField
            label="Reporting Manager"
            htmlFor="reportingManager"
          >
            <Input
              id="reportingManager"
              name="reportingManager"
              placeholder="John Smith"
              required
            />
          </FormField>

          <FormField
            label="Work Location"
            htmlFor="location"
          >
            <Input
              id="location"
              name="location"
              placeholder="Hyderabad"
              required
            />
          </FormField>

          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? isRegenerate
                  ? "Regenerating..."
                  : "Generating..."
                : isRegenerate
                  ? "Regenerate PDFs"
                  : "Generate PDFs"}
            </Button>

            <Button
              type="button"
              variant="secondary"
              onClick={() => onToggle(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}
    </ActionPanel>
  );
}