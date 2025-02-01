import { z } from "zod";

export const createServerSchema = z.object({
  serverName: z
    .string()
    .min(1, "Required")
    .min(3, "Server name minimum 3 character.")
    .max(100),
  imageUrl: z.string().url("Invalid URL"),
});

export type TCreateServerSchema = z.infer<typeof createServerSchema>;
