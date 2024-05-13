import z from "zod";

const voyagerResponseSchema = z.object({
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

export class VoyagerEmbeddingFunction {
  private readonly apiKey: string;
  private readonly model: string;

  constructor({
    apiKey,
    model,
  }: {
    apiKey: string;
    model: "voyager-2" | "voyage-large-2";
  }) {
    this.apiKey = apiKey;
    this.model = model;
  }

  public async generate(input: string[]): Promise<number[][]> {
    const res = await fetch("https://api.voyageai.com/v1/embeddings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({ input, model: this.model }),
    });

    const json = await res.json();
    const embeddings = voyagerResponseSchema.parse(json);
    return embeddings?.data.map(({ embedding }) => embedding);
  }
}
