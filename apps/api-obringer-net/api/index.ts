import type { VercelResponse } from "@vercel/node";

export default async function handler(_: never, res: VercelResponse) {
  res.status(200).json("OK");
}
