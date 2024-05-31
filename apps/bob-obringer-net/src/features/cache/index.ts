import { unstable_cache } from "next/cache";

type CacheKey = "sanity:skills" | "sanity:companies";

export function cache(fn: () => Promise<unknown>, key: CacheKey) {
  return unstable_cache(async () => await fn(), [key], { tags: [key] })();
}
