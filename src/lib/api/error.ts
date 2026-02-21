// API Error class - cannot be in a "use server" file
export class ApiError extends Error {
  constructor(
    public message: string,
    public status: number,
    public details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = "ApiError";
  }
}
