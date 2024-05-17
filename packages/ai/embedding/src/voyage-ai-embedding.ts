import type { EmbeddingService } from "./types";
import z from "zod";
import { ResultAsync } from "neverthrow";

const voyageResponseSchema = z.object({
  data: z.array(
    z.object({
      object: z.literal("embedding"),
      embedding: z.array(z.number()),
      index: z.number(),
    }),
  ),
  model: z.string(),
  usage: z.object({
    total_tokens: z.number(),
  }),
});

export class VoyageAiEmbedding implements EmbeddingService {
  private readonly apiKey: string;

  constructor({ apiKey }: { apiKey: string }) {
    this.apiKey = apiKey;
  }

  private async _generate(input: Array<string>) {
    const res = await fetch("https://api.voyageai.com/v1/embeddings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({ input, model: "voyage-large-2" }),
    });

    const json = await res.json();
    const embeddings = voyageResponseSchema.parse(json);
    return embeddings?.data.map(({ embedding }) => embedding);
  }

  public generate(input: Array<string>) {
    return ResultAsync.fromPromise(this._generate(input), (error) =>
      error instanceof Error ? error : new Error(String(error)),
    );
  }
}
