"use server";

import { CurrentUser } from "@/lib/current-user";
import { db } from "@/lib/db";
import { createServerSchema, TCreateServerSchema } from "@/lib/zod-schema";
import { MemberRole } from "@prisma/client";
import { v4 as uuid } from "uuid";

//create server:
export async function createServerAction(values: TCreateServerSchema) {
  try {
    const validation = createServerSchema.safeParse(values);
    if (!validation.success) return { error: "Invalid inputs!" };

    const { imageUrl, serverName } = validation.data;

    const profile = await CurrentUser();

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

    return { success: "Server create successful.", newServer };
  } catch (error) {
    console.log(error);
    return { error: "Something went wrong!" };
  }
}

//Update server:
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

//Update manager role:
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

    const updateMember = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        members: {
          update: {
            where: {
              id: memberId,
            },
            data: {
              role: newRole,
            },
          },
        },
      },
      include: {
        members: {
          select: {
            id: true,
            Profile: true,
            role: true,
          },
        },
      },
    });

    return { success: "User role update successful.", updateMember };
  } catch (error) {
    console.log("Update user role error:", error);
    return { error: "Something went wrong!" };
  }
}

//Leave server:
export async function leaveServerAction(serverId: string) {
  if (!serverId) return { error: "Server id not found!" };

  const profile = await CurrentUser();
  if (!profile) return { error: "Unauthorized" };

  await db.server.update({
    where: {
      id: serverId,
      profileId: { not: profile.id },
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
    data: {
      members: {
        deleteMany: {
          profileId: profile.id,
        },
      },
    },
  });
  return { success: true };
}

//Delete server:
export async function deleteServerAction(serverId: string) {
  if (!serverId) return { error: "Server id not found!" };

  const profile = await CurrentUser();
  if (!profile) return { error: "Unauthorized" };

  try {
    await db.member.deleteMany({ where: { serverId } });
    await db.channel.deleteMany({ where: { serverId } });

    await db.server.delete({
      where: { id: serverId, profileId: profile.id },
    });

    return { success: "Delete successful." };
  } catch (error) {
    console.error(error);
    return { error: "Failed to delete server" };
  }
}
