import { ReactNode } from "react";

import {
  Card,
  CardBody,
  CardHeader,
} from "@/components/ui/card";

interface ActionPanelProps {
  title?: string;
  description?: string;
  children: ReactNode;
}

export function ActionPanel({
  title = "Actions",
  description,
  children,
}: ActionPanelProps) {
  return (
    <Card>
      <CardHeader
        title={title}
        description={description}
      />

      <CardBody className="space-y-3">
        {children}
      </CardBody>
    </Card>
  );
}