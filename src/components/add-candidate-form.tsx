"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Copy, Check } from "lucide-react";

import { createCandidate } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";

type JobOption = {
  id: string;
  title: string;
  status: string;
};

export function AddCandidateForm({
  jobs,
}: {
  jobs: JobOption[];
}) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [magicLink, setMagicLink] = useState("");
  const [copied, setCopied] = useState(false);

  const openJobs = jobs.filter((job) => job.status === "OPEN");

  async function handleSubmit(formData: FormData) {
    try {
      setLoading(true);
      setError("");

      const resume = formData.get("resume") as File | null;

      if (resume && resume.size > 10 * 1024 * 1024) {
        setError("Resume must be smaller than 10 MB.");
        return;
      }

      const result = await createCandidate(formData);

      if (result.error) {
        setError(result.error);
        return;
      }

      if (result.magicLink) {
        setMagicLink(result.magicLink);
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(magicLink);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setError("Unable to copy the application link.");
    }
  }

  if (magicLink) {
    return (
      <Card className="max-w-2xl">
        <CardHeader
          title="Candidate added"
          description="Share this magic link with the candidate to complete their application."
        />

        <CardBody className="space-y-4">
          <div className="rounded-lg border border-border bg-gray-50 p-4">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">
              Application link (expires in 14 days)
            </p>

            <p className="select-all break-all font-mono text-sm">
              {magicLink}
            </p>
          </div>

          <div className="flex gap-3">
            <Button onClick={copyLink}>
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy link
                </>
              )}
            </Button>

            <Button
              variant="secondary"
              onClick={() => router.push("/dashboard")}
            >
              Go to dashboard
            </Button>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="max-w-3xl">
      <CardHeader
        title="Candidate details"
        description="Upload a resume and assign the candidate to an open role."
      />

      <CardBody>
        <form action={handleSubmit} className="space-y-4">
          <FormField label="Full name" htmlFor="name">
            <Input
              id="name"
              name="name"
              required
              disabled={loading}
              className="h-11"
            />
          </FormField>

          <FormField label="Email" htmlFor="email">
            <Input
              id="email"
              name="email"
              type="email"
              className="h-11"
              required
              disabled={loading}
            />
          </FormField>

          <FormField
  label="Job opening"
  htmlFor="jobOpeningId"
>
  <Select
    id="jobOpeningId"
    name="jobOpeningId"
    defaultValue=""
    required
    disabled={loading || openJobs.length === 0}
  >
    <option value="" disabled>
      Select a role
    </option>

    {openJobs.map((job) => (
      <option key={job.id} value={job.id}>
        {job.title}
      </option>
    ))}
  </Select>

  {openJobs.length === 0 && (
    <p className="mt-2 text-sm text-muted">
      There are currently no open job openings.
    </p>
  )}
</FormField>

          <FormField label="Resume" htmlFor="resume">
            <Input
              id="resume"
              name="resume"
              type="file"
              accept="application/pdf"
              required
              disabled={loading}
            />
          </FormField>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              disabled={loading || openJobs.length === 0}
            >
              {loading ? "Adding..." : "Add candidate"}
            </Button>

            <Link href="/dashboard">
              <Button
                type="button"
                variant="secondary"
                disabled={loading}
                className="cursor-pointer"
              >
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}