"use client";

import { Channel, ChannelType, MemberRole, Server } from "@prisma/client";
import { Edit, Hash, Lock, Mic, Trash, Video } from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";
import { TooltipAction } from "../tooltip-action";
import { useModal } from "@/store/use-modal-store";

interface ServerChannelProps {
  channel: Channel;
  server?: Server;
  role?: MemberRole;
}

const iconMap = {
  [ChannelType.TEXT]: Hash,
  [ChannelType.VOICE]: Mic,
  [ChannelType.VIDEO]: Video,
};

export default function ServerChannel({
  channel,
  server,
  role,
}: ServerChannelProps) {
  const Icon = iconMap[channel.channelType];
  const { onOpen } = useModal();

  const params = useParams();

  return (
    <div className="px-2">
      <button className="group flex w-full items-center gap-x-1 rounded-md p-1 hover:bg-slate-200 dark:hover:bg-primary-foreground">
        <Icon className="h-4 w-4" />
        <p
          className={cn(
            params.channelId === channel.id && "text-sm font-thin text-primary",
          )}
        >
          {channel.channelName}
        </p>
        {channel.channelName !== "general" && role !== MemberRole.GUEST && (
          <div className="ml-auto flex items-center gap-x-1">
            <TooltipAction label="Edit">
              <Edit
                onClick={() => onOpen("edit-channel", { server, channel })}
                className="hidden h-4 w-4 hover:text-primary group-hover:block"
              />
            </TooltipAction>
            <TooltipAction label="Delete">
              <Trash
                onClick={() => onOpen("delete-channel", { server, channel })}
                className="hidden h-4 w-4 hover:text-destructive group-hover:block"
              />
            </TooltipAction>
          </div>
        )}
        {channel.channelName === "general" && (
          <Lock className="ml-auto h-4 w-4 text-muted-foreground" />
        )}
      </button>
    </div>
  );
}
