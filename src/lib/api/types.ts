export type FieldErrors = Record<string, string[]>;

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: FieldErrors };

export class ApiError extends Error {
  public status: number;
  public fieldErrors?: FieldErrors;

  constructor(message: string, status: number, fieldErrors?: FieldErrors) {
    super(message);
    this.status = status;
    this.fieldErrors = fieldErrors;
    this.name = "ApiError";
  }
}
