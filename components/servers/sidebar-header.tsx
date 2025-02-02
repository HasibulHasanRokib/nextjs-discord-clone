"use client";

import { MemberRole } from "@prisma/client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  ChevronDown,
  LogOut,
  PlusCircle,
  Settings,
  Trash,
  UserPlus,
  Users,
} from "lucide-react";

import { ServerWithMemberWithProfile } from "@/lib/types";
import { useModal } from "@/store/use-modal-store";

interface SidebarHeaderProps {
  server: ServerWithMemberWithProfile;
  role?: MemberRole;
}

export function SidebarHeader({ server, role }: SidebarHeaderProps) {
  const { onOpen } = useModal();

  const isAdmin = role === MemberRole.ADMIN;
  const isModerator = isAdmin || role === MemberRole.MODERATOR;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="focus:outline-none">
          <button className="flex h-12 w-full items-center border-b px-3 text-sm capitalize transition dark:border-muted-foreground">
            {server.serverName}
            <ChevronDown className="ml-auto h-5 w-5 text-muted-foreground" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 text-xs">
          {isModerator && (
            <>
              <DropdownMenuItem
                onClick={() => onOpen("invite-people", { server })}
                className="cursor-pointer"
              >
                Invite People
                <UserPlus className="ml-auto h-4 w-4" />
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onOpen("create-channel", { server })}
                className="cursor-pointer"
              >
                Create Channel
                <PlusCircle className="ml-auto h-4 w-4" />
              </DropdownMenuItem>
            </>
          )}
          {isAdmin && (
            <>
              <DropdownMenuItem
                onClick={() => onOpen("manage-member", { server })}
                className="cursor-pointer"
              >
                Manage Members
                <Users className="ml-auto h-4 w-4" />
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onOpen("server-setting", { server })}
                className="cursor-pointer"
              >
                Server Setting
                <Settings className="ml-auto h-4 w-4" />
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onOpen("delete-server", { server })}
                className="cursor-pointer"
              >
                Delete Server <Trash className="ml-auto h-4 w-4" />
              </DropdownMenuItem>
            </>
          )}
          {!isAdmin && (
            <DropdownMenuItem
              onClick={() => onOpen("leave-server", { server })}
              className="cursor-pointer"
            >
              Leave Server <LogOut className="ml-auto h-4 w-4" />
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
