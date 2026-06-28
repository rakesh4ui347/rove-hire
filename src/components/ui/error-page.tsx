"use client";

import { useEffect } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export function ErrorPage({
  error,
  reset,
  homeHref = "/dashboard",
  homeLabel = "Back to dashboard",
}: ErrorProps & {
  homeHref?: string;
  homeLabel?: string;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-6 text-center">
      <div className="max-w-md space-y-4">
        <h1 className="text-2xl font-semibold tracking-tight">
          Something went wrong
        </h1>
        <p className="text-sm leading-6 text-muted">
          An unexpected error occurred. Try again, or return to the dashboard.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Button onClick={reset}>Try again</Button>
          <Link href={homeHref}>
            <Button variant="secondary">{homeLabel}</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
