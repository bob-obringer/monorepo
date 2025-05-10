import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook";
import createHttpError, { HttpError } from "http-errors";
import { type MutationOperation, type SanityDocument } from "@sanity/client";
import type { ReadableStream } from "node:stream/web";
import { revalidatePath, revalidateTag } from "next/cache";

type SanityWebhookHandler<T extends SanityDocument = SanityDocument> = {
  documentType: string;
  operations?: MutationOperation | Array<MutationOperation>;
} & (
  | {
      handler: (doc: T, operation?: MutationOperation) => Promise<void>;
      revalidatePath?: string | Array<string>;
      revalidateTag?: string | Array<string>;
    }
  | {
      handler?: (doc: T, operation?: MutationOperation) => Promise<void>;
      revalidatePath: string | Array<string>;
      revalidateTag?: string | Array<string>;
    }
  | {
      handler?: (doc: T, operation?: MutationOperation) => Promise<void>;
      revalidatePath?: string | Array<string>;
      revalidateTag: string | Array<string>;
    }
);

function getErrorResponse(error: unknown): Response {
  const httpError =
    error instanceof HttpError
      ? error
      : createHttpError(
          500,
          error instanceof Error ? error.message : "Unknown Error",
        );

  return Response.json(
    {
      success: false,
      error: {
        name: httpError.name,
        message: httpError.message,
        statusCode: httpError.statusCode,
      },
    },
    { status: httpError.statusCode, statusText: httpError.name },
  );
}

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
        return getErrorResponse(e);
      }

      const sanityOperation = req.headers.get(
        "sanity-operation",
      ) as MutationOperation;

      try {
        for (const {
          operations,
          handler,
          documentType,
          revalidatePath: _revalidatePath,
          revalidateTag: _revalidateTag,
        } of handlers) {
          if (!isTargetDocumentType<T>(doc, documentType)) continue;

          const ops = Array.isArray(operations) ? operations : [operations];
          // Handle case where operations might be undefined
          if (operations && !ops.includes(sanityOperation)) continue;

          console.log(
            `Sanity Webhook: ${sanityOperation} ${doc._type} (${doc._id})`,
          );

          if (_revalidatePath) {
            const paths = Array.isArray(_revalidatePath)
              ? _revalidatePath
              : [_revalidatePath];
            for (const path of paths) revalidatePath(path, "page");
          }

          if (_revalidateTag) {
            const tags = Array.isArray(_revalidateTag)
              ? _revalidateTag
              : [_revalidateTag];
            for (const tag of tags) revalidateTag(tag);
          }

          if (handler) await handler(doc, sanityOperation);
        }
        return new Response("OK", { status: 200 });
      } catch (e) {
        return getErrorResponse(e);
      }
    },
  };
}

function isTargetDocumentType<T extends SanityDocument>(
  doc: SanityDocument,
  documentType: string,
): doc is T {
  return doc._type === documentType;
}

async function verifyBody(req: Request, secret: string) {
  if (!req.body) throw createHttpError(400, "Missing Body");

  const signature = req.headers.get(SIGNATURE_HEADER_NAME);
  if (!signature) throw createHttpError(403, "Missing Signature");

  const body = await req.text();
  const isValidRequest = await isValidSignature(body, signature, secret);

  if (!isValidRequest) throw createHttpError(403, "Invalid Signature");

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
