"use server";

import { CurrentUser } from "@/lib/current-user";
import { db } from "@/lib/db";
import {
  createServerSchema,
  TCreateServerSchema,
} from "@/lib/zod-schema/server-schema";
import { MemberRole } from "@prisma/client";
import { uuid } from "uuidv4";

export async function createServerAction(values: TCreateServerSchema) {
  try {
    const validation = createServerSchema.safeParse(values);
    if (!validation.success) return { error: "Invalid inputs!" };

    const { imageUrl, serverName } = validation.data;

    const profile = await CurrentUser();

    if (!profile) return { error: "Unauthorized" };
    await db.server.create({
      data: {
        serverName,
        imageUrl,
        profileId: profile.id,
        inviteLink: uuid(),
        channel: {
          create: {
            channelName: "general",
            profileId: profile.id,
          },
        },
        member: {
          create: {
            profileId: profile.id,
            role: MemberRole.ADMIN,
          },
        },
      },
    });
    return { success: "Server create successful." };
  } catch (error) {
    console.log(error);
    return { error: "Something went wrong!" };
  }
}
