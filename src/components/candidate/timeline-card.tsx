import { TimelineEvent } from "@prisma/client";

import {
  Card,
  CardBody,
  CardHeader,
} from "@/components/ui/card";

import { formatDateTime } from "@/lib/utils";

interface TimelineCardProps {
  events: TimelineEvent[];
}

export function TimelineCard({
  events,
}: TimelineCardProps) {
  return (
    <Card>
      <CardHeader
        title="Timeline"
        description="Most recent activity first"
      />

      <CardBody>
        {events.length === 0 ? (
          <p className="text-sm text-muted">
            No activity yet.
          </p>
        ) : (
          <ol className="space-y-6">
            {events.map((event) => (
              <TimelineItem
                key={event.id}
                event={event}
              />
            ))}
          </ol>
        )}
      </CardBody>
    </Card>
  );
}

interface TimelineItemProps {
  event: TimelineEvent;
}

function TimelineItem({
  event,
}: TimelineItemProps) {
  return (
    <li className="relative border-l-2 border-border pl-6">
      <span className="absolute -left-[7px] top-1 h-3 w-3 rounded-full border-2 border-white bg-accent" />

      <p className="text-base font-semibold">
        {event.title}
      </p>

      {event.description && (
        <p className="mt-1 leading-6 text-muted">
          {event.description}
        </p>
      )}

      <p className="mt-2 text-xs text-muted">
        {formatDateTime(event.createdAt)}
      </p>
    </li>
  );
}