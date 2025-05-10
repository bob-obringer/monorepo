import { z } from "zod";

const configSchema = z.object({
  cdnUrl: z.string().url(),
});

export const config = configSchema.parse({
  cdnUrl: "https://s3.amazonaws.com/cdn.obringer.net/",
});
