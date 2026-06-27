"use client";

import { Check, Copy, Loader2 } from "lucide-react";
import { CandidateStatus } from "@prisma/client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardBody,
  CardHeader,
} from "@/components/ui/card";

interface MagicLinkCardProps {
  candidateStatus: CandidateStatus;
  magicLink: string;
  copied: boolean;
  loading: string;
  onGenerate: () => void;
  onCopy: () => void;
}

export function MagicLinkCard({
  candidateStatus,
  magicLink,
  copied,
  loading,
  onGenerate,
  onCopy,
}: MagicLinkCardProps) {
  if (candidateStatus !== "APPLIED") {
    return null;
  }

  return (
    <Card>
      <CardHeader title="Application Link" />

      <CardBody className="space-y-4">
        <p className="text-sm text-muted">
          Generate a secure magic link for the
          candidate to complete their
          application.
        </p>

        {magicLink && (
          <div className="rounded-lg bg-gray-50 p-3 font-mono text-xs break-all">
            {magicLink}
          </div>
        )}

        <Button
          variant="secondary"
          className="w-full"
          disabled={loading === "magic"}
          onClick={onGenerate}
        >
          {loading === "magic" && (
            <Loader2 className="h-4 w-4 animate-spin" />
          )}
          {loading === "magic"
            ? "Generating..."
            : magicLink
              ? "Regenerate Link"
              : "Generate Link"}
        </Button>

        {magicLink && (
          <Button
            className="w-full"
            onClick={onCopy}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy Link
              </>
            )}
          </Button>
        )}
      </CardBody>
    </Card>
  );
}