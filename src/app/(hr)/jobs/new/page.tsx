"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { createJobOpening } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Card, CardBody, CardHeader } from "@/components/ui/card";

export default function NewJobPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(formData: FormData) {
    try {
      setLoading(true);
      setError("");

      const result = await createJobOpening(formData);

      if (result.error) {
        setError(result.error);
        return;
      }

      router.push("/jobs");
      router.refresh();
    } catch (error) {
      console.error(error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/jobs"
          className="text-sm text-muted transition-colors hover:text-foreground"
        >
          ← Back to jobs
        </Link>

        <h1 className="mt-2 text-2xl font-semibold tracking-tight">
          Create Job Opening
        </h1>
      </div>

      <Card className="max-w-3xl">
        <CardHeader
          title="Job details"
          description="Define the role and required skills."
        />

        <CardBody>
          <form action={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="title"
                className="mb-1.5 block text-sm font-medium"
              >
                Title
              </label>

              <Input
                id="title"
                name="title"
                placeholder="Senior Full-Stack Engineer"
                required
                disabled={loading}
                className="h-11"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="mb-1.5 block text-sm font-medium"
              >
                Description
              </label>

              <Textarea
                id="description"
                name="description"
                placeholder="Describe the role, responsibilities, and team..."
                required
                disabled={loading}
                className="min-h-[180px] resize-y"
              />
            </div>

            <div>
              <label
                htmlFor="skills"
                className="mb-1.5 block text-sm font-medium"
              >
                Required skills
              </label>

              <Input
                id="skills"
                name="skills"
                placeholder="React, TypeScript, Node.js"
                required
                disabled={loading}
                className="h-11"
              />
            </div>

            <div>
              <label
                htmlFor="status"
                className="mb-1.5 block text-sm font-medium"
              >
                Status
              </label>

              <Select
                id="status"
                name="status"
                defaultValue="OPEN"
                disabled={loading}
                className="h-11"
              >
                <option value="OPEN">Open</option>
                <option value="CLOSED">Closed</option>
              </Select>
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            )}

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create opening"}
              </Button>

              <Link href="/jobs">
                <Button
                  type="button"
                  variant="secondary"
                  disabled={loading}
                >
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}