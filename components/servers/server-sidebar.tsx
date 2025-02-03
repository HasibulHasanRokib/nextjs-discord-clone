import { CurrentUser } from "@/lib/current-user";
import { ServerSidebarHeader } from "./server-sidebar-header";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { ScrollArea } from "../ui/scroll-area";
import { ChannelType } from "@prisma/client";
import { ServerSection } from "./server-section";
import ServerChannel from "./server-channel";
import { ServerMember } from "./server-member";

export async function ServerSidebar({ serverId }: { serverId: string }) {
  const profile = await CurrentUser();
  if (!profile) return redirect("/");

  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      members: {
        include: {
          Profile: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      },
      channels: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  if (!server) return redirect("/");

  const role = server?.members.find(
    (member) => member.profileId === profile.id,
  )?.role;

  const textChannels = server.channels.filter(
    (channel) => channel.channelType === ChannelType.TEXT,
  );
  const voiceChannels = server.channels.filter(
    (channel) => channel.channelType === ChannelType.VOICE,
  );
  const videoChannels = server.channels.filter(
    (channel) => channel.channelType === ChannelType.VIDEO,
  );

  const members = server.members.filter(
    (member) => member.profileId !== profile.id,
  );
  return (
    <div className="w-60 bg-secondary">
      <ServerSidebarHeader server={server} role={role} />
      <ScrollArea>
        {!!textChannels.length && (
          <div className="mb-2">
            <ServerSection
              label="Text Channel"
              role={role}
              sectionType="channels"
              server={server}
              channelType={ChannelType.TEXT}
            />
            {textChannels.map((channel) => (
              <ServerChannel
                key={channel.id}
                server={server}
                role={role}
                channel={channel}
              />
            ))}
          </div>
        )}
        {!!voiceChannels.length && (
          <div className="mb-2">
            <ServerSection
              label="Voice Channel"
              role={role}
              sectionType="channels"
              server={server}
              channelType={ChannelType.VOICE}
            />
            {voiceChannels.map((channel) => (
              <ServerChannel
                key={channel.id}
                server={server}
                role={role}
                channel={channel}
              />
            ))}
          </div>
        )}
        {!!videoChannels.length && (
          <div className="mb-2">
            <ServerSection
              label="Video Channel"
              role={role}
              sectionType="channels"
              server={server}
              channelType={ChannelType.VIDEO}
            />
            {videoChannels.map((channel) => (
              <ServerChannel
                key={channel.id}
                server={server}
                role={role}
                channel={channel}
              />
            ))}
          </div>
        )}
        {!!members.length && (
          <div className="mb-2">
            <ServerSection
              label="Members"
              role={role}
              sectionType="members"
              server={server}
            />
            {members.map((member) => (
              <ServerMember key={member.id} member={member} />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
