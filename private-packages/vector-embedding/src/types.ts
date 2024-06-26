import type { ResultAsync } from "neverthrow";

export interface EmbeddingService {
  generate(input: string[]): ResultAsync<number[][], Error>;
}
