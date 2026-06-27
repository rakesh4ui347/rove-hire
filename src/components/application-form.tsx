"use client";

import { useState } from "react";
import { submitApplication } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { FormField } from "./ui/form-field";

interface FormInputField {
  id: string;
  label: string;
  placeholder: string;
  type?: React.HTMLInputTypeAttribute;
  autoComplete?: string;
  helperText?: string;
  required: boolean;
}

const fields: FormInputField[] = [
  {
    id: "phone",
    label: "Phone number",
    type: "tel",
    placeholder: "+1 (555) 000-0000",
    autoComplete: "tel",
    required: true,
  },
  {
    id: "location",
    label: "Current location",
    placeholder: "City, Country",
    required: true,
  },
  {
    id: "currentRole",
    label: "Current role",
    placeholder: "Your current job title",
    required: true,
  },
  {
    id: "noticePeriod",
    label: "Notice period",
    placeholder: "e.g. 2 weeks, Immediate",
    required: true,
  },
  {
    id: "salaryExpectation",
    label: "Salary expectation",
    placeholder: "e.g. $120,000 - $140,000",
    required: true,
  },
  {
    id: "linkedInUrl",
    label: "LinkedIn URL",
    type: "url",
    placeholder: "https://linkedin.com/in/your-profile",
    helperText: "Optional",
    required: false,
  },
] as const;

export function ApplicationForm({
  token,
  candidateName,
  jobTitle,
}: {
  token: string;
  candidateName: string;
  jobTitle: string;
}) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(formData: FormData) {
    try {
      setLoading(true);
      setError("");
  
      const result = await submitApplication(token, formData);
  
      if (
        result.error &&
        !["invalid", "expired", "used"].includes(result.error)
      ) {
        setError(result.error);
        return;
      }
  
      if (result.success) {
        setSubmitted(true);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6">
        <Card className="max-w-md w-full text-center">
          <CardBody className="py-12">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 text-xl">
              ✓
            </div>
            <h1 className="text-xl font-semibold">Application submitted!</h1>
            <p className="mt-2 text-sm text-muted">
              Thanks, {candidateName}. Our HR team will review your application and be in touch soon.
            </p>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
      <Card className="w-full max-w-lg">
        <CardHeader
          title="Complete your application"
          description={`Hi ${candidateName}, please fill in your details for the ${jobTitle} role at ROVE.`}
        />
       <CardBody>
  <form action={handleSubmit} className="space-y-4">
    {fields.map((field) => (
      <FormField
        key={field.id}
        label={field.label}
        htmlFor={field.id}
        helperText={field.helperText}
      >
        <Input
          id={field.id}
          name={field.id}
          type={field.type ?? "text"}
          placeholder={field.placeholder}
          autoComplete={field.autoComplete}
          inputMode={
            field.type === "tel" ? "tel" : undefined
          }
          required={field.required}
          disabled={loading}
          className="h-11"
        />
      </FormField>
    ))}

    {error && (
      <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
        {error}
      </p>
    )}

    <Button
      type="submit"
      className="h-11 w-full"
      disabled={loading}
    >
      {loading
        ? "Submitting..."
        : "Submit Application"}
    </Button>
  </form>
</CardBody>
      </Card>
    </div>
  );
}
