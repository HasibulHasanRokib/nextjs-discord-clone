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

interface UpdateUserRoleProps {
  memberId: string;
  serverId: string;
  newRole: MemberRole;
}

export async function updateUserRole(values: UpdateUserRoleProps) {
  try {
    if (!values) return { error: "Invalid values" };

    const { memberId, newRole, serverId } = values;

    const profile = await CurrentUser();

    if (!profile) return { error: "Unauthorized" };
    if (!serverId) return { error: "Server id not found" };
    if (!memberId) return { error: "Member id not found" };

    if (newRole === MemberRole.KICK) {
      await db.server.update({
        where: {
          id: serverId,
          profileId: profile.id,
        },
        data: {
          members: {
            delete: {
              id: memberId,
              profileId: {
                not: profile.id,
              },
            },
          },
        },
      });
      return { success: "This member kick from server." };
    }

    await db.member.update({
      where: {
        id: memberId,
        serverId: serverId,
        profileId: {
          not: profile.id,
        },
      },
      data: {
        role: newRole,
      },
    });

    return { success: "User role update successful." };
  } catch (error) {
    console.log("Update user role error:", error);
    return { error: "Something went wrong!" };
  }
}
