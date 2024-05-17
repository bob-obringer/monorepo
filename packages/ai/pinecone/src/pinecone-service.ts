import {
  Index,
  Pinecone,
  type QueryResponse,
  type RecordId,
  type RecordMetadata,
} from "@pinecone-database/pinecone";
import type { EmbeddingService } from "@bob-obringer/ai-embedding";
import { ResultAsync } from "neverthrow";

export class PineconeService {
  private readonly pinecone: Pinecone;
  private readonly embeddingService: EmbeddingService;
  private readonly env: string;

  constructor({
    apiKey,
    embeddingService,
    env,
  }: {
    apiKey: string;
    env: string;
    embeddingService: EmbeddingService;
  }) {
    this.pinecone = new Pinecone({ apiKey });
    this.embeddingService = embeddingService;
    this.env = env;
  }

  private async _getOrCreateIndex(
    baseIndexName: string,
    retryDelay: number = 1000,
    maxRetries: number = 5,
  ): Promise<Index> {
    const indexName = `${this.env ? `${this.env}-` : ""}${baseIndexName}`;
    const index = this.pinecone.index(indexName);

    const { indexes } = await this.pinecone.listIndexes();
    if (!indexes) {
      throw new Error("No indexes found");
    }

    const indexExists = indexes?.find(({ name }) => name === indexName);

    if (indexExists) {
      const info = await this.pinecone.describeIndex(indexName);
      if (info?.status.ready) {
        return index;
      }
      if (maxRetries > 0) {
        retryDelay *= 2;
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            this._getOrCreateIndex(indexName, retryDelay, maxRetries - 1)
              .then(resolve)
              .catch(reject);
          }, retryDelay);
        });
      } else {
        throw new Error("Max retries exceeded");
      }
    }

    await this.pinecone.createIndex({
      name: indexName,
      dimension: 1536,
      metric: "cosine",
      spec: {
        serverless: {
          cloud: "aws",
          region: "us-east-1",
        },
      },
    });
    return await this._getOrCreateIndex(indexName);
  }

  getOrCreateIndex(
    name: string,
    retryDelay: number = 1000,
    maxRetries: number = 5,
  ): ResultAsync<Index, Error> {
    return ResultAsync.fromPromise(
      this._getOrCreateIndex(name, retryDelay, maxRetries),
      (error) => (error instanceof Error ? error : new Error(String(error))),
    );
  }

  upsert(
    indexName: string,
    items: Array<EmbeddableRecord>,
  ): ResultAsync<void, Error> {
    const textToEmbed = items.map(({ text }) => text);

    // todo: the pinecone service shouldn't be responsible for this part
    //  we should have an abstraction around embedding service and vector db
    //  that lets us plug and play
    return this.embeddingService.generate(textToEmbed).map(async (vectors) => {
      if (vectors.length !== items.length) {
        throw new Error("Mismatched number of embeddings");
      }

      const records = items.map((item, i) => ({
        id: item.id,
        values: vectors[i]!,
        metadata: item.metadata,
      }));

      const index = await this.getOrCreateIndex(indexName);
      if (index.isOk()) {
        return index.value.upsert(records);
      } else {
        throw index.error;
      }
    });
  }

  query(
    indexName: string,
    query: string,
    topK: number = 10,
  ): ResultAsync<QueryResponse, Error> {
    return this.getOrCreateIndex(indexName).map(async (index) => {
      const vectors = await this.embeddingService.generate([query]);
      if (vectors.isErr()) {
        throw vectors.error;
      }

      return index.query({
        vector: vectors.value[0]!,
        topK,
      });
    });
  }
}

export type EmbeddableRecord = {
  id: RecordId;
  text: string;
  metadata?: RecordMetadata;
};
