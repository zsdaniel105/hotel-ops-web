export type ErrorCode = "VALIDATION" | "UNAUTHENTICATED" | "FORBIDDEN" | "NOT_FOUND" | "CONFLICT" | "SERVER";
export class AppError extends Error { constructor(public code: ErrorCode, message: string, public status: number) { super(message); } }
export function errorResponse(error: unknown): Response {
  const known = error instanceof AppError;
  const status = known ? error.status : 500;
  return Response.json({ error: { code: known ? error.code : "SERVER", message: known ? error.message : "The operation could not be completed." } }, { status });
}
