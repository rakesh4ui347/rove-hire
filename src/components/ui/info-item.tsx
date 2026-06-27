import { ReactNode } from "react";

interface InfoItemProps {
  label: string;
  value?: ReactNode;
  link?: boolean;
}

export function InfoItem({
  label,
  value,
  link = false,
}: InfoItemProps) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-muted">
        {label}
      </dt>

      <dd className="mt-1 text-sm font-medium text-foreground">
        {!value ? (
          <span className="font-normal text-muted">—</span>
        ) : link ? (
          <a
            href={String(value)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            {value}
          </a>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}