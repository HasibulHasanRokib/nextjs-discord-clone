"use server";

import { CurrentUser } from "@/lib/current-user";
import { db } from "@/lib/db";
import { createChannelSchema } from "@/lib/zod-schema";
import { ChannelType, MemberRole } from "@prisma/client";

interface CreateChannelProps {
  channelName: string;
  type: ChannelType;
  serverId: string;
}

export async function createChannelAction(values: CreateChannelProps) {
  try {
    const validation = createChannelSchema.safeParse(values);
    if (!validation.success) return { error: "Invalid inputs." };

    const { channelName, type } = validation.data;
    const profile = await CurrentUser();

    if (!profile) return { error: "Unauthorized" };
    if (channelName.toLowerCase() === "general")
      return { error: "Channel name cannot be 'General'" };
    if (!values.serverId) return { error: "Server id not found" };

    await db.server.update({
      where: {
        id: values.serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          create: {
            channelName,
            channelType: type,
            profileId: profile.id,
          },
        },
      },
    });
    return { success: "Create Successful" };
  } catch (error) {
    console.log("Create channel error:", error);
    return { error: "Something went wrong." };
  }
}
