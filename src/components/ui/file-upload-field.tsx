"use client";

import {
  useRef,
  useState,
  DragEvent,
  ChangeEvent,
  KeyboardEvent,
  MouseEvent,
} from "react";
import { FileText, Upload, X } from "lucide-react";

import { cn } from "@/lib/utils";

const DEFAULT_MAX_SIZE = 10 * 1024 * 1024;

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function validateFile(file: File, maxSize: number): string | null {
  if (file.type !== "application/pdf") {
    return "Resume must be a PDF file.";
  }

  if (file.size > maxSize) {
    return `File must be smaller than ${formatFileSize(maxSize)}.`;
  }

  return null;
}

function setInputFiles(input: HTMLInputElement, file: File | null) {
  const transfer = new DataTransfer();
  if (file) {
    transfer.items.add(file);
  }
  input.files = transfer.files;
}

interface FileUploadFieldProps {
  id: string;
  name: string;
  accept?: string;
  disabled?: boolean;
  required?: boolean;
  maxSize?: number;
  helperText?: string;
}

export function FileUploadField({
  id,
  name,
  accept = "application/pdf",
  disabled = false,
  required = false,
  maxSize = DEFAULT_MAX_SIZE,
  helperText = "PDF only, up to 10 MB",
}: FileUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");

  function applyFile(file: File | null) {
    if (!inputRef.current) return;

    if (!file) {
      setSelectedFile(null);
      setError("");
      setInputFiles(inputRef.current, null);
      return;
    }

    const validationError = validateFile(file, maxSize);
    if (validationError) {
      setSelectedFile(null);
      setError(validationError);
      setInputFiles(inputRef.current, null);
      return;
    }

    setSelectedFile(file);
    setError("");
    setInputFiles(inputRef.current, file);
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    applyFile(file);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    const file = event.dataTransfer.files?.[0] ?? null;
    applyFile(file);
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  }

  function handleDragLeave(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
  }

  function openFilePicker() {
    if (!disabled) {
      inputRef.current?.click();
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openFilePicker();
    }
  }

  function clearFile(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    applyFile(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        id={id}
        name={name}
        type="file"
        accept={accept}
        required={required && !selectedFile}
        disabled={disabled}
        className="sr-only"
        onChange={handleInputChange}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : `${id}-helper`}
      />

      {selectedFile ? (
        <div
          className={cn(
            "flex items-center gap-3 rounded-lg border border-border bg-white p-4",
            disabled && "opacity-60"
          )}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
            <FileText className="h-5 w-5" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">
              {selectedFile.name}
            </p>
            <p className="text-xs text-muted">
              {formatFileSize(selectedFile.size)}
            </p>
          </div>

          {!disabled && (
            <button
              type="button"
              onClick={clearFile}
              className="rounded-md p-1.5 text-muted transition-colors hover:bg-gray-100 hover:text-foreground"
              aria-label="Remove file"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      ) : (
        <div
          role="button"
          tabIndex={disabled ? -1 : 0}
          onClick={openFilePicker}
          onKeyDown={handleKeyDown}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-8 text-center transition-colors",
            isDragging
              ? "border-accent bg-accent/5"
              : "border-border bg-gray-50/50 hover:border-accent/50 hover:bg-accent/5",
            error && "border-red-300 bg-red-50/50",
            disabled && "cursor-not-allowed opacity-60"
          )}
        >
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
            <Upload className="h-5 w-5 text-muted" />
          </div>

          <p className="text-sm font-medium text-foreground">
            {isDragging ? "Drop your resume here" : "Drag & drop your resume"}
          </p>
          <p className="mt-1 text-xs text-muted">
            or{" "}
            <span className="font-medium text-accent">browse files</span>
          </p>
        </div>
      )}

      {error ? (
        <p id={`${id}-error`} className="text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : (
        <p id={`${id}-helper`} className="text-sm text-muted">
          {helperText}
        </p>
      )}
    </div>
  );
}
