import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";
import { headers } from "next/headers";

type Unit = "ms" | "s" | "m" | "h" | "d";
type Duration = `${number} ${Unit}` | `${number}${Unit}`;

export function rateLimit(tokens: number, duration: Duration) {
  const h = headers();
  const ip = h.get("x-real-ip") ?? h.get("x-forwarded-for");

  return new Ratelimit({
    redis: kv,
    limiter: Ratelimit.slidingWindow(tokens, duration),
  }).limit(ip ?? "anonymous");
}
