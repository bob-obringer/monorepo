import { HttpError, HttpErrorInternalServerError } from "./errors";

/**
 * Get a response object from an error.
 * @param error Can be anything.  If it's an HttpError, it will be used as is.
 * Otherwise, it will be wrapped in a 500 Internal Server Error with a message if it
 * exists, or an "Unknown Error" message if it doesn't
 * @returns A response object with `{ success: false, error: { name, message, statusCode } }` and
 * http status code and status text set to the error's status code and name
 */
export function unstable_getErrorResponse(error: unknown): Response {
  const e =
    error instanceof HttpError
      ? error
      : new HttpErrorInternalServerError(
          hasMessage(error) ? error.message : "Unknown Error",
        );

  return Response.json(
    {
      success: false,
      error: {
        name: e.name,
        message: e.message,
        statusCode: e.statusCode,
      },
    },
    { status: e.statusCode, statusText: e.name },
  );
}

function hasMessage(error: unknown): error is Error {
  return error instanceof Error && Boolean(error.message);
}
