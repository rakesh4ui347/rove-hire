import { ReactNode } from "react";

import {
  Card,
  CardBody,
} from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: number;
  icon: ReactNode;
}

export function StatCard({
  title,
  value,
  icon,
}: StatCardProps) {
  return (
    <Card>
      <CardBody className="flex items-center justify-between p-5">
        <div>
          <p className="text-sm text-muted">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold tracking-tight">
            {value}
          </p>
        </div>

        <div className="rounded-xl bg-accent/10 p-3 text-accent">
          {icon}
        </div>
      </CardBody>
    </Card>
  );
}