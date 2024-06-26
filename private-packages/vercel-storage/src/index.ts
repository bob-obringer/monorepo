import {
  put,
  list,
  type ListBlobResultBlob,
  type PutBlobResult,
} from "@vercel/blob";
import { Readable } from "stream";

export class VercelBlob {
  private readonly token: string;

  constructor({ token }: { token: string }) {
    this.token = token;
  }

  async getFileInfo(path: string): Promise<ListBlobResultBlob | null> {
    const [fileName, fileExtension] = path.split(".");

    const { blobs } = await list({ prefix: fileName, token: this.token });
    const matchingBlob = blobs.find((blob) =>
      blob.pathname.endsWith(`.${fileExtension}`),
    );
    return matchingBlob ?? null;
  }

  async download(path: string): Promise<ArrayBuffer> {
    return this.getFileInfo(path)
      .then((info) => {
        if (!info?.downloadUrl) {
          throw new Error(`Could not find file "${path}"`);
        }
        return fetch(info.downloadUrl);
      })
      .then((response) => response.arrayBuffer());
  }

  async upload(path: string, file: PutBody): Promise<PutBlobResult> {
    return put(path, file, {
      token: this.token,
      addRandomSuffix: false,
      access: "public",
    });
  }
}

type PutBody =
  | string
  | Readable
  | Buffer
  | Blob
  | ArrayBuffer
  | ReadableStream
  | File;
