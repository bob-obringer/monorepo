import type { Result as NeverthrowResult } from "neverthrow";
import type { HttpStatusCode } from "@bob-obringer/http-errors";

export type InnerServerActionResult<R> = NeverthrowResult<R, Error> | R;

export type ServerActionSuccessResponse<R> = {
  success: true;
  value: R;
};

export type ServerActionErrorResponse = {
  success: false;
  error: {
    message: string;
    name: string;
    statusCode: HttpStatusCode;
  };
};

export type ServerActionResponse<R> =
  | ServerActionSuccessResponse<R>
  | ServerActionErrorResponse;

/*
  Standard Server Action
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type InnerServerActionFunction<P = void, R = any> = P extends void
  ? () => Promise<InnerServerActionResult<R>>
  : (params: P) => Promise<InnerServerActionResult<R>>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ServerAction<P = void, R = any> = P extends void
  ? () => Promise<ServerActionResponse<R>>
  : (params: P) => Promise<ServerActionResponse<R>>;
