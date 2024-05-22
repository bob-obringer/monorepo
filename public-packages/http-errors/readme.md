# @bob-obringer/http-errors

A collection of HTTP Error Classes.

## Installation

```bash
pnpm install @bob-obringer/http-errors
```

```bash
npm install @bob-obringer/http-errors
```

```bash
yarn add @bob-obringer/http-errors
```

## Usage

```typescript
import { HttpErrorBadRequest } from "@bob-obringer/http-errors";

// Throw a new HTTP error
throw new HttpErrorBadRequest("Bad request error message");
```

Each HTTP error class extends the base `HttpError` class and sets the HTTP status code and error name accordingly. You can use these classes to throw or handle specific HTTP errors in your application.

## HTTP Error Classes

The following HTTP error classes are available:

- `HttpErrorBadRequest` (400)
- `HttpErrorUnauthorized` (401)
- `HttpErrorForbidden` (403)
- `HttpErrorNotFound` (404)
- `HttpErrorMethodNotAllowed` (405)
- `HttpErrorNotAcceptable` (406)
- `HttpErrorProxyAuthenticationRequired` (407)
- `HttpErrorRequestTimeout` (408)
- `HttpErrorConflict` (409)
- `HttpErrorGone` (410)
- `HttpErrorLengthRequired` (411)
- `HttpErrorPreconditionFailed` (412)
- `HttpErrorPayloadTooLarge` (413)
- `HttpErrorURITooLong` (414)
- `HttpErrorUnsupportedMediaType` (415)
- `HttpErrorRangeNotSatisfiable` (416)
- `HttpErrorExpectationFailed` (417)
- `HttpErrorImATeapot` (418)
- `HttpErrorUnprocessableEntity` (422)
- `HttpErrorTooEarly` (425)
- `HttpErrorUpgradeRequired` (426)
- `HttpErrorPreconditionRequired` (428)
- `HttpErrorTooManyRequests` (429)
- `HttpErrorRequestHeaderFieldsTooLarge` (431)
- `HttpErrorUnavailableForLegalReasons` (451)
- `HttpErrorInternalServerError` (500)
- `HttpErrorNotImplemented` (501)
- `HttpErrorBadGateway` (502)
- `HttpErrorServiceUnavailable` (503)
- `HttpErrorGatewayTimeout` (504)
- `HttpErrorHTTPVersionNotSupported` (505)
- `HttpErrorVariantAlsoNegotiates` (506)
- `HttpErrorInsufficientStorage` (507)
- `HttpErrorLoopDetected` (508)
- `HttpErrorNotExtended` (510)
- `HttpErrorNetworkAuthenticationRequired` (511)
