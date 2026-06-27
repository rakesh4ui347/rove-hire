import { FormEvent } from "react";
import { toast } from "sonner";

import { ActionResult } from "@/types/action-result";

type SubmitFormActionOptions = {
  action: (formData: FormData) => Promise<ActionResult>;
  onStart?: () => void;
  onSuccess?: () => void;
  onFinish?: () => void;
  successMessage?: string;
};

export async function submitFormAction(
  event: FormEvent<HTMLFormElement>,
  {
    action,
    onStart,
    onSuccess,
    onFinish,
    successMessage,
  }: SubmitFormActionOptions
) {
  event.preventDefault();
  onStart?.();

  try {
    const formData = new FormData(event.currentTarget);
    const result = await action(formData);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    if (successMessage) {
      toast.success(successMessage);
    }

    onSuccess?.();
  } catch (error) {
    console.error(error);
    toast.error("Something went wrong. Please try again.");
  } finally {
    onFinish?.();
  }
}
