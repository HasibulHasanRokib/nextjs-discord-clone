"use server";

import { CurrentUser } from "@/lib/current-user";
import { db } from "@/lib/db";
import { createServerSchema, TCreateServerSchema } from "@/lib/zod-schema";
import { MemberRole } from "@prisma/client";
import { v4 as uuid } from "uuid";

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

    return { success: "Server create successful." };
  } catch (error) {
    console.log(error);
    return { error: "Something went wrong!" };
  }
}

interface UpdateServerProps {
  id: string;
  serverName: string;
  imageUrl: string;
}
export async function updateServerAction(values: UpdateServerProps) {
  try {
    if (!values) return { error: "Server not found!" };

    const validation = createServerSchema.safeParse(values);
    if (!validation.success) return { error: "Invalid inputs!" };

    const { imageUrl, serverName } = validation.data;

    const profile = await CurrentUser();

    if (!profile) return { error: "Unauthorized" };

    await db.server.update({
      where: {
        id: values.id,
        profileId: profile.id,
      },
      data: {
        serverName,
        imageUrl,
      },
    });

    return { success: "Server update successful." };
  } catch (error) {
    console.log(error);
    return { error: "Something went wrong!" };
  }
}
