import { ReactNode } from "react";

interface FormFieldProps {
  label: string;
  htmlFor: string;
  children: ReactNode;
  helperText?: ReactNode;
  required?: boolean;
}

export function FormField({
  label,
  htmlFor,
  children,
  helperText,
  required = false,
}: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={htmlFor}
        className="block text-sm font-medium text-foreground"
      >
        {label}
        {required && (
          <span
            className="ml-1 text-red-500"
            aria-hidden="true"
          >
            *
          </span>
        )}
      </label>

      {children}

      {helperText && (
        <div className="text-sm text-muted">
          {helperText}
        </div>
      )}
    </div>
  );
}