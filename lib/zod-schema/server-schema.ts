import { z } from "zod";

export const createServerSchema = z.object({
  serverName: z.string().min(1, "Server name is required").max(100),
  imageUrl: z.string().min(1, "Image is required").max(100),
});

export type TCreateServerSchema = z.infer<typeof createServerSchema>;
