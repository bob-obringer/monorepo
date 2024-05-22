import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook";
import {
  HttpError,
  HttpErrorBadRequest,
  HttpErrorForbidden,
} from "@bob-obringer/http-errors";
import { type MutationOperation, type SanityDocument } from "@sanity/client";
import type { ReadableStream } from "node:stream/web";

type SanityWebhookHandler<T extends SanityDocument = SanityDocument> = {
  handler: (doc: T, operation?: MutationOperation) => Promise<void>;
  documentType: string;
  operations?: MutationOperation | Array<MutationOperation>;
};

export function createSanityWebhook<T extends SanityDocument>({
  handlers,
  secret,
}: {
  handlers: Array<SanityWebhookHandler<T>>;
  secret: string;
}): { POST: (req: Request) => Promise<Response> } {
  return {
    async POST(req: Request) {
      let doc: SanityDocument;
      try {
        doc = await verifyBody(req, secret);
      } catch (e) {
        if (e instanceof HttpError)
          return Response.json(e.message, { status: e.statusCode });
        return Response.json(e instanceof Error ? e.message : "Unknown Error", {
          status: 500,
        });
      }

      const operation = req.headers.get(
        "sanity-operation",
      ) as MutationOperation;

      try {
        for (const handler of handlers) {
          if (
            handler.documentType === doc._type &&
            isDocument<T>(doc, handler.documentType)
          ) {
            const operationMatch =
              typeof handler.operations === "string"
                ? operation === handler.operations
                : handler.operations?.includes(operation);
            if (operationMatch) {
              console.log(
                `Handling Sanity Webhook: ${operation}, ${doc._type}, ${doc._id}`,
              );
              await handler.handler(doc, operation);
            }
          }
        }
        return new Response("OK", { status: 200 });
      } catch (e) {
        console.log(e as Error);
        return new Response("Error", { status: 500 });
      }
    },
  };
}

function isDocument<T extends SanityDocument>(
  doc: SanityDocument,
  documentType: string,
): doc is T {
  return doc._type === documentType;
}

async function verifyBody(req: Request, secret: string) {
  const signature = req.headers.get(SIGNATURE_HEADER_NAME);
  if (!req.body) {
    throw new HttpErrorBadRequest("Missing Body");
  }
  const body = await readBody(req.body);
  if (!signature || !(await isValidSignature(body, signature, secret))) {
    throw new HttpErrorForbidden("Invalid Signature");
  }

  return JSON.parse(body) as SanityDocument;
}

async function readBody(readable: ReadableStream<Uint8Array>): Promise<string> {
  const reader = readable.getReader();
  const chunks: Uint8Array[] = [];
  try {
    let result = await reader.read();
    while (!result.done) {
      chunks.push(result.value);
      result = await reader.read();
    }
  } finally {
    reader.releaseLock();
  }

  return Buffer.concat(chunks).toString("utf8");
}
