"use server";

import { CurrentUser } from "@/lib/current-user";
import { db } from "@/lib/db";
import { createChannelSchema } from "@/lib/zod-schema";
import { ChannelType, MemberRole } from "@prisma/client";

//Create channel:
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

// Edit channel:
interface EditChannelActionProps {
  channelName: string;
  type: ChannelType;
  serverId: string;
  channelId: string;
}

export async function editChannelAction(values: EditChannelActionProps) {
  try {
    const validation = createChannelSchema.safeParse(values);

    if (!validation.success) return { error: "Invalid inputs" };

    const { channelName, type } = validation.data;
    const { serverId, channelId } = values;

    const profile = await CurrentUser();
    if (!profile) return { error: "Unauthorized" };

    if (!serverId) return { error: "Server Id not found." };
    if (!channelId) return { error: "Channel Id not found." };

    await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        channels: {
          update: {
            where: {
              id: channelId,
            },
            data: {
              channelName,
              channelType: type,
            },
          },
        },
      },
    });

    return { success: "Channel information update successful" };
  } catch (error) {
    console.log(error);
    return { error: "Channel edit failed! Try again later" };
  }
}

//Delete channel:
interface DeleteChannelActionProps {
  serverId: string;
  channelId: string;
}

export async function deleteChannelAction(values: DeleteChannelActionProps) {
  const { serverId, channelId } = values;
  const profile = await CurrentUser();

  if (!profile) return false;
  if (!serverId) return false;
  if (!channelId) return false;

  await db.server.update({
    where: {
      id: serverId,
      profileId: profile.id,
    },
    data: {
      channels: {
        delete: {
          id: channelId,
        },
      },
    },
  });

  return true;
}
