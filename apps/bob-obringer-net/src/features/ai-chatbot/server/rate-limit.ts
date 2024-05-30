import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";
import { headers } from "next/headers";

const rateLimiter = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.fixedWindow(5, "30s"),
});

export function rateLimit() {
  const h = headers();
  const ip = h.get("x-real-ip") ?? h.get("x-forwarded-for");
  return rateLimiter.limit(ip ?? "anonymous");
}
