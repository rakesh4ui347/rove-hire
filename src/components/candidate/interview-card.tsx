import { Interview } from "@prisma/client";

import {
  Card,
  CardBody,
  CardHeader,
} from "@/components/ui/card";
import { InterviewItem } from "../interview/interview-item";


interface InterviewCardProps {
  interviews: Interview[];
  loading: string;
  onCompleteInterview: (
    interviewId: string,
    formData: FormData
  ) => Promise<boolean>;
}

export function InterviewCard({
  interviews,
  loading,
  onCompleteInterview,
}: InterviewCardProps) {
  if (!interviews.length) {
    return null;
  }

  return (
    <Card>
      <CardHeader title="Interviews" />

      <CardBody className="space-y-4">
        {interviews.map((interview) => (
          <InterviewItem
            key={interview.id}
            interview={interview}
            loading={loading}
            onCompleteInterview={
              onCompleteInterview
            }
          />
        ))}
      </CardBody>
    </Card>
  );
}