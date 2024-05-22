export type HttpStatusCode =
  | 400 // Bad Request
  | 401 // Unauthorized
  | 403 // Forbidden
  | 404 // Not Found
  | 405 // Method Not Allowed
  | 406 // Not Acceptable
  | 407 // Proxy Authentication Required
  | 408 // Request Timeout
  | 409 // Conflict
  | 410 // Gone
  | 411 // Length Required
  | 412 // Precondition Failed
  | 413 // Payload Too Large
  | 414 // URI Too Long
  | 415 // Unsupported Media Type
  | 416 // Range Not Satisfiable
  | 417 // Expectation Failed
  | 418 // I'm a teapot
  | 422 // Unprocessable Entity
  | 425 // Too Early
  | 426 // Upgrade Required
  | 428 // Precondition Required
  | 429 // Too Many Requests
  | 431 // Request Header Fields Too Large
  | 451 // Unavailable For Legal Reasons
  | 500 // Internal Server Error
  | 501 // Not Implemented
  | 502 // Bad Gateway
  | 503 // Service Unavailable
  | 504 // Gateway Timeout
  | 505 // HTTP Version Not Supported
  | 506 // Variant Also Negotiates
  | 507 // Insufficient Storage
  | 508 // Loop Detected
  | 510 // Not Extended
  | 511; // Network Authentication Required;

export type HttpErrorName =
  | "HttpError"
  | "BadRequestError" // 400
  | "UnauthorizedError" // 401
  | "ForbiddenError" // 403
  | "NotFoundError" // 404
  | "MethodNotAllowedError" // 405
  | "NotAcceptableError" // 406
  | "ProxyAuthenticationRequiredError" // 407
  | "RequestTimeoutError" // 408
  | "ConflictError" // 409
  | "GoneError" // 410
  | "LengthRequiredError" // 411
  | "PreconditionFailedError" // 412
  | "PayloadTooLargeError" // 413
  | "URITooLongError" // 414
  | "UnsupportedMediaTypeError" // 415
  | "RangeNotSatisfiableError" // 416
  | "ExpectationFailedError" // 417
  | "ImATeapotError" // 418
  | "UnprocessableEntityError" // 422
  | "TooEarlyError" // 425
  | "UpgradeRequiredError" // 426
  | "PreconditionRequiredError" // 428
  | "TooManyRequestsError" // 429
  | "RequestHeaderFieldsTooLargeError" // 431
  | "UnavailableForLegalReasonsError" // 451
  | "InternalServerError" // 500
  | "NotImplementedError" // 501
  | "BadGatewayError" // 502
  | "ServiceUnavailableError" // 503
  | "GatewayTimeoutError" // 504
  | "HTTPVersionNotSupportedError" // 505
  | "VariantAlsoNegotiatesError" // 506
  | "InsufficientStorageError" // 507
  | "LoopDetectedError" // 508
  | "NotExtendedError" // 510
  | "NetworkAuthenticationRequiredError"; // 511

export class HttpError extends Error {
  public override name: HttpErrorName;
  public readonly statusCode: HttpStatusCode;
  constructor(statusCode: HttpStatusCode, message: string = "") {
    super(message);
    this.name = "HttpError";
    this.statusCode = statusCode;
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

export class HttpErrorMethodNotAllowed extends HttpError {
  constructor(message?: string) {
    super(405, message);
    this.name = "MethodNotAllowedError";
  }
}

export class HttpErrorNotAcceptable extends HttpError {
  constructor(message?: string) {
    super(406, message);
    this.name = "NotAcceptableError";
  }
}

export class HttpErrorProxyAuthenticationRequired extends HttpError {
  constructor(message?: string) {
    super(407, message);
    this.name = "ProxyAuthenticationRequiredError";
  }
}

export class HttpErrorRequestTimeout extends HttpError {
  constructor(message?: string) {
    super(408, message);
    this.name = "RequestTimeoutError";
  }
}

export class HttpErrorConflict extends HttpError {
  constructor(message?: string) {
    super(409, message);
    this.name = "ConflictError";
  }
}

export class HttpErrorGone extends HttpError {
  constructor(message?: string) {
    super(410, message);
    this.name = "GoneError";
  }
}

export class HttpErrorLengthRequired extends HttpError {
  constructor(message?: string) {
    super(411, message);
    this.name = "LengthRequiredError";
  }
}

export class HttpErrorPreconditionFailed extends HttpError {
  constructor(message?: string) {
    super(412, message);
    this.name = "PreconditionFailedError";
  }
}

export class HttpErrorPayloadTooLarge extends HttpError {
  constructor(message?: string) {
    super(413, message);
    this.name = "PayloadTooLargeError";
  }
}

export class HttpErrorURITooLong extends HttpError {
  constructor(message?: string) {
    super(414, message);
    this.name = "URITooLongError";
  }
}

export class HttpErrorUnsupportedMediaType extends HttpError {
  constructor(message?: string) {
    super(415, message);
    this.name = "UnsupportedMediaTypeError";
  }
}

export class HttpErrorRangeNotSatisfiable extends HttpError {
  constructor(message?: string) {
    super(416, message);
    this.name = "RangeNotSatisfiableError";
  }
}

export class HttpErrorExpectationFailed extends HttpError {
  constructor(message?: string) {
    super(417, message);
    this.name = "ExpectationFailedError";
  }
}

export class HttpErrorImATeapot extends HttpError {
  constructor(message?: string) {
    super(418, message);
    this.name = "ImATeapotError";
  }
}

export class HttpErrorUnprocessableEntity extends HttpError {
  constructor(message?: string) {
    super(422, message);
    this.name = "UnprocessableEntityError";
  }
}

export class HttpErrorTooEarly extends HttpError {
  constructor(message?: string) {
    super(425, message);
    this.name = "TooEarlyError";
  }
}

export class HttpErrorUpgradeRequired extends HttpError {
  constructor(message?: string) {
    super(426, message);
    this.name = "UpgradeRequiredError";
  }
}

export class HttpErrorPreconditionRequired extends HttpError {
  constructor(message?: string) {
    super(428, message);
    this.name = "PreconditionRequiredError";
  }
}

export class HttpErrorTooManyRequests extends HttpError {
  constructor(message?: string) {
    super(429, message);
    this.name = "TooManyRequestsError";
  }
}

export class HttpErrorRequestHeaderFieldsTooLarge extends HttpError {
  constructor(message?: string) {
    super(431, message);
    this.name = "RequestHeaderFieldsTooLargeError";
  }
}

export class HttpErrorUnavailableForLegalReasons extends HttpError {
  constructor(message?: string) {
    super(451, message);
    this.name = "UnavailableForLegalReasonsError";
  }
}

export class HttpErrorInternalServerError extends HttpError {
  constructor(message?: string) {
    super(500, message);
    this.name = "InternalServerError";
  }
}

export class HttpErrorNotImplemented extends HttpError {
  constructor(message?: string) {
    super(501, message);
    this.name = "NotImplementedError";
  }
}

export class HttpErrorBadGateway extends HttpError {
  constructor(message?: string) {
    super(502, message);
    this.name = "BadGatewayError";
  }
}

export class HttpErrorServiceUnavailable extends HttpError {
  constructor(message?: string) {
    super(503, message);
    this.name = "ServiceUnavailableError";
  }
}

export class HttpErrorGatewayTimeout extends HttpError {
  constructor(message?: string) {
    super(504, message);
    this.name = "GatewayTimeoutError";
  }
}

export class HttpErrorHTTPVersionNotSupported extends HttpError {
  constructor(message?: string) {
    super(505, message);
    this.name = "HTTPVersionNotSupportedError";
  }
}

export class HttpErrorVariantAlsoNegotiates extends HttpError {
  constructor(message?: string) {
    super(506, message);
    this.name = "VariantAlsoNegotiatesError";
  }
}

export class HttpErrorInsufficientStorage extends HttpError {
  constructor(message?: string) {
    super(507, message);
    this.name = "InsufficientStorageError";
  }
}

export class HttpErrorLoopDetected extends HttpError {
  constructor(message?: string) {
    super(508, message);
    this.name = "LoopDetectedError";
  }
}

export class HttpErrorNotExtended extends HttpError {
  constructor(message?: string) {
    super(510, message);
    this.name = "NotExtendedError";
  }
}

export class HttpErrorNetworkAuthenticationRequired extends HttpError {
  constructor(message?: string) {
    super(511, message);
    this.name = "NetworkAuthenticationRequiredError";
  }
}
