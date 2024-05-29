import { list } from "@vercel/blob";

export class VercelBlob {
  private readonly token: string;

  constructor({ token }: { token: string }) {
    this.token = token;
  }

  async download(path: string): Promise<ArrayBuffer> {
    console.log(await list({ token: this.token }));

    return list({ prefix: path, token: this.token })
      .then(({ blobs }) => blobs[0]?.downloadUrl)
      .then((url) => {
        if (!url) {
          throw new Error(`Could not find file "${path}"`);
        }
        return fetch(url);
      })
      .then((font) => font.arrayBuffer());
  }
}
