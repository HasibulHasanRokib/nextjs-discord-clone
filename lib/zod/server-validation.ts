import { z } from "zod";

export const createServer = z.object({
  serverName: z.string().min(1, "Server name is required").max(100),
  imageUrl: z.string().min(1, "Image is required").max(100),
});

export type TCreateServer = z.infer<typeof createServer>;
