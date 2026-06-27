import Link from "next/link";
import { Download, FileText } from "lucide-react";

import { ActionPanel } from "./action-panel";

type DocumentItem = {
  id: string;
  filename: string;
  type: string;
};

interface DocumentsCardProps {
  documents: DocumentItem[];
}

export function DocumentsCard({
  documents,
}: DocumentsCardProps) {
  if (documents.length === 0) {
    return null;
  }

  return (
    <ActionPanel
      title="Documents"
      description="Uploaded and generated documents"
    >
      {documents.map((document) => (
        <Link
          key={document.id}
          href={`/api/documents/${document.id}`}
          className="flex items-center justify-between rounded-lg border border-border p-3 transition-colors hover:bg-gray-50"
        >
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-accent" />

            <div>
              <p className="font-medium">
                {document.filename}
              </p>

              <p className="text-xs capitalize text-muted">
                {document.type
                  .toLowerCase()
                  .replaceAll("_", " ")}
              </p>
            </div>
          </div>

          <Download className="h-4 w-4 text-muted" />
        </Link>
      ))}
    </ActionPanel>
  );
}