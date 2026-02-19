import type { FieldErrors } from "@/lib/api/types";

type RawFieldErrors = Record<string, string[] | undefined>;

export function normalizeFieldErrors(fieldErrors: RawFieldErrors): FieldErrors {
  const normalized: FieldErrors = {};

  for (const [key, value] of Object.entries(fieldErrors)) {
    if (!value || value.length === 0) {
      continue;
    }
    normalized[key] = value;
  }

  return normalized;
}

function getFirstFieldError(fieldErrors?: FieldErrors): string | null {
  if (!fieldErrors) {
    return null;
  }

  for (const errors of Object.values(fieldErrors)) {
    const firstError = errors?.find((error) => Boolean(error?.trim()));
    if (firstError) {
      return firstError;
    }
  }

  return null;
}

export function buildValidationErrorMessage(options: {
  fieldErrors?: FieldErrors;
  formErrors?: string[];
  fallback?: string;
}): string {
  const formError = options.formErrors?.find((error) => Boolean(error?.trim()));
  if (formError) {
    return formError;
  }

  const fieldError = getFirstFieldError(options.fieldErrors);
  if (fieldError) {
    return fieldError;
  }

  return options.fallback ?? "Please review the form fields.";
}
