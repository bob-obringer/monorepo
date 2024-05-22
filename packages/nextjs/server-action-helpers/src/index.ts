import {
  HttpError,
  HttpErrorInternalServerError,
} from "@bob-obringer/http-errors";
import type { Result as NeverthrowResult } from "neverthrow";
import type {
  InnerServerActionFunction,
  InnerServerActionResult,
  ServerAction,
  ServerActionErrorResponse,
  ServerActionResponse,
  ServerActionSuccessResponse,
} from "./types";

/**
 * A client for executing server actions.
 *
 * It provides high order functions which:
 *  - receive a function that returns a neverthrow Result
 *  - serializes the result into a ServerActionResponse
 *    which can be passed to the server action caller
 */
export class ServerActionClient {
  private readonly environment: "development" | "production";

  /**
   * Create a new ServerActionClient
   */
  constructor({ environment }: { environment: "development" | "production" }) {
    this.environment = environment;
  }

  // todo: it would be great if we could return the actual error
  //  info in dev mode
  private handleError(err: unknown): ServerActionErrorResponse {
    const { message, name, statusCode } =
      err instanceof HttpError ? err : new HttpErrorInternalServerError();
    return {
      success: false,
      error: { message, name, statusCode },
    };
  }

  /**
   * Serialize the server action result
   * @param innerServerActionResult
   * @private
   */
  private handleResponse<R>(
    innerServerActionResult: InnerServerActionResult<R>,
  ): ServerActionResponse<R> {
    if (!isNeverthrowResult(innerServerActionResult)) {
      return {
        success: true,
        value: innerServerActionResult,
      } as ServerActionSuccessResponse<R>;
    }

    if (innerServerActionResult.isOk()) {
      return {
        success: true,
        value: innerServerActionResult.value,
      } as ServerActionSuccessResponse<R>;
    }

    return this.handleError(innerServerActionResult.error);
  }

  /**
   * Create a server action
   * @param innerFunction The inner function which can return a
   * value or  neverthrow Result
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  create<P = void, R = any>(
    innerFunction: InnerServerActionFunction<P, R>,
  ): ServerAction<P, R> {
    const serverAction = async (
      params?: P,
    ): Promise<ServerActionResponse<R>> => {
      try {
        const innerResult = await innerFunction(params as P);
        return this.handleResponse(innerResult);
      } catch (e) {
        return this.handleError(e);
      }
    };

    return serverAction as ServerAction<P, R>;
  }
}

// typeguard function to see if an object has an isOk function
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isNeverthrowResult<T>(obj: any): obj is NeverthrowResult<T, Error> {
  return obj.isOk !== undefined;
}
