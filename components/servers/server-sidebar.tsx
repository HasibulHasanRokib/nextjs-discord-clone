import { CurrentUser } from "@/lib/current-user";
import { SidebarHeader } from "./sidebar-header";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
// import { ChannelType } from "@prisma/client";

export async function ServerSidebar({ serverId }: { serverId: string }) {
  const profile = await CurrentUser();
  if (!profile) return redirect("/");

  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      channels: {
        orderBy: {
          createdAt: "asc",
        },
      },
      members: {
        include: {
          Profile: true,
        },

        orderBy: {
          role: "asc",
        },
      },
    },
  });

  // const textChannels = server?.channels.filter(
  //   (channel) => channel.channelType === ChannelType.TEXT,
  // );
  // const voiceChannels = server?.channels.filter(
  //   (channel) => channel.channelType === ChannelType.VOICE,
  // );
  // const videoChannels = server?.channels.filter(
  //   (channel) => channel.channelType === ChannelType.VIDEO,
  // );

  // const members = server?.members.filter(
  //   (member) => member.profileId !== profile.id,
  // );
  const role = server?.members.find(
    (member) => member.profileId === profile.id,
  )?.role;

  if (!server) return redirect("/");

  return (
    <div className="w-60 bg-slate-50">
      <SidebarHeader server={server} role={role} />
    </div>
  );
}
