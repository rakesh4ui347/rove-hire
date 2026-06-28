"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";

import { createJobOpening } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { toast } from "sonner";

export default function NewJobPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setLoading(true);

      const result = await createJobOpening(new FormData(event.currentTarget));

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Job opening created.");
      router.push("/jobs");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
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
          <form onSubmit={handleSubmit} className="space-y-4">
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
                className="min-h-[180px] resize-y font-mono text-sm"
              />
              <p className="mt-1.5 text-xs text-muted">
                Markdown supported: **bold**, *italic*, bullet lists, and ## headings.
              </p>
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

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
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