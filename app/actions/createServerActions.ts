"use server";

import { CurrentUser } from "@/lib/current-user";
import { db } from "@/lib/db";
import {
  createServerSchema,
  TCreateServerSchema,
} from "@/lib/zod-schema/server-schema";
import { MemberRole } from "@prisma/client";
import { v4 as uuid } from "uuid";

export async function createServerAction(values: TCreateServerSchema) {
  try {
    const validation = createServerSchema.safeParse(values);
    if (!validation.success) return { error: "Invalid inputs!" };

    const { imageUrl, serverName } = validation.data;
    console.log({ imageUrl, serverName });

    const profile = await CurrentUser();
    console.log({ profile });

    if (!profile) return { error: "Unauthorized" };
    const newServer = await db.server.create({
      data: {
        serverName,
        imageUrl,
        profileId: profile.id,
        inviteCode: uuid(),
        channels: {
          create: {
            channelName: "general",
            profileId: profile.id,
          },
        },
        members: {
          create: {
            profileId: profile.id,
            role: MemberRole.ADMIN,
          },
        },
      },
    });
    console.log({ newServer });
    return { success: "Server create successful." };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong!" };
  }
}
