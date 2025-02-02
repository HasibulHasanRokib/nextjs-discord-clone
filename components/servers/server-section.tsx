"use client";
import { ServerWithMemberWithProfile } from "@/lib/types";
import { ChannelType, MemberRole } from "@prisma/client";
import { Plus } from "lucide-react";
import React from "react";
import { TooltipAction } from "../tooltip-action";
import { useModal } from "@/store/use-modal-store";

interface ServerSectionProps {
  label: string;
  role?: MemberRole;
  sectionType: "channels" | "members";
  channelType?: ChannelType;
  server?: ServerWithMemberWithProfile;
}

export function ServerSection({
  label,
  role,
  sectionType,
  server,
  channelType,
}: ServerSectionProps) {
  const { onOpen } = useModal();

  return (
    <div className="flex items-center justify-between p-2">
      <p className="text-sm font-semibold">{label}</p>
      {role !== MemberRole.GUEST && sectionType === "channels" && (
        <TooltipAction label="Create Channel" side="right" aline="center">
          <button onClick={() => onOpen("create-channel", { server })}>
            <Plus className="h-4 w-4" />
          </button>
        </TooltipAction>
      )}
    </div>
  );
}
