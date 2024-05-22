import { HttpError, HttpErrorInternalServerError } from "./errors";

export function getErrorResponse(error: unknown): Response {
  const e =
    error instanceof HttpError
      ? error
      : error instanceof Error && error.name
        ? new HttpError(500, error.name)
        : new HttpErrorInternalServerError();

  return Response.json(
    {
      success: false,
      statusCode: e.statusCode,
      name: e.name,
    },
    { status: e.statusCode },
  );
}
