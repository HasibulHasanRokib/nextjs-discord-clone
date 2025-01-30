"use client";
import { MemberRole } from "@prisma/client";
import React from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ServerWithMembersWithProfiles } from "@/types";
import {
  ChevronDown,
  LogOut,
  PlusCircle,
  Settings,
  Trash,
  UserPlus,
  Users,
} from "lucide-react";
import { useModal } from "@/store/modal-store";

interface SidebarHeaderProps {
  server: ServerWithMembersWithProfiles;
  role?: MemberRole;
}

export function SidebarHeader({ server, role }: SidebarHeaderProps) {
  const isAdmin = role === MemberRole.ADMIN;
  const isModerator = isAdmin || role === MemberRole.MODERATOR;
  const { onOpen } = useModal();

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="focus:outline-none">
          <button className="flex h-12 w-full items-center border-b-2 px-3 font-sans capitalize transition">
            {server.serverName}
            <ChevronDown className="ml-auto h-5 w-5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 text-xs">
          {isModerator && (
            <>
              <DropdownMenuItem
                onClick={() => onOpen("invite-people", { server })}
                className="cursor-pointer"
              >
                Invite People <UserPlus className="ml-auto h-4 w-4" />
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                Create channel <PlusCircle className="ml-auto h-4 w-4" />
              </DropdownMenuItem>
            </>
          )}
          {isAdmin && (
            <>
              <DropdownMenuItem className="cursor-pointer">
                Server Setting <Settings className="ml-auto h-4 w-4" />
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                Manage Members <Users className="ml-auto h-4 w-4" />
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                Delete Server <Trash className="ml-auto h-4 w-4" />
              </DropdownMenuItem>
            </>
          )}
          {!isAdmin && (
            <DropdownMenuItem className="cursor-pointer">
              Leave Server <LogOut className="ml-auto h-4 w-4" />
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
