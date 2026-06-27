import { CandidateStatus } from "@prisma/client";
import { Select } from "@/components/ui/select";
import { CANDIDATE_STATUS_OPTIONS } from "@/lib/constants";

type CandidateStatusFilterProps = {
  value: CandidateStatus | "ALL";
  onChange: (value: CandidateStatus | "ALL") => void;
  className?: string;
};


export function CandidateStatusFilter({
  value,
  onChange,
  className,
}: CandidateStatusFilterProps) {
  return (
    <Select
      value={value}
      onChange={(e) =>
        onChange(e.target.value as CandidateStatus | "ALL")
      }
      className={className}
    >
      {CANDIDATE_STATUS_OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </Select>
  );
}