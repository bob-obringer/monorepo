import type { Result as NeverthrowResult } from "neverthrow";

export type InnerServerActionResult<R> = NeverthrowResult<R, Error> | R;

export type ServerActionSuccessResponse<R> = {
  success: true;
  value: R;
};

/**
 * An error returned by a server action
 */
export type ServerActionError = {
  readonly message: string;
  readonly name: string;
  readonly statusCode: number;
};

export type ServerActionErrorResponse = {
  success: false;
  error: ServerActionError;
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
