export type HttpStatus = 400 | 401 | 403 | 404 | 500;
export type HttpStatusName =
  | "HttpError"
  | "BadRequestError"
  | "UnauthorizedError"
  | "ForbiddenError"
  | "NotFoundError"
  | "InternalServerError";

export class HttpError extends Error {
  public override name: HttpStatusName;
  public readonly status: HttpStatus;
  constructor(status: HttpStatus, message: string = "") {
    super(message);
    this.name = "HttpError";
    this.status = status;
  }
}

export class HttpErrorBadRequest extends HttpError {
  constructor(message?: string) {
    super(400, message);
    this.name = "BadRequestError";
  }
}

export class HttpErrorUnauthorized extends HttpError {
  constructor(message?: string) {
    super(401, message);
    this.name = "UnauthorizedError";
  }
}

export class HttpErrorForbidden extends HttpError {
  constructor(message?: string) {
    super(403, message);
    this.name = "ForbiddenError";
  }
}

export class HttpErrorNotFound extends HttpError {
  constructor(message?: string) {
    super(404, message);
    this.name = "NotFoundError";
  }
}

export class HttpErrorInternalServer extends HttpError {
  constructor(message?: string) {
    super(500, message);
    this.name = "InternalServerError";
  }
}
