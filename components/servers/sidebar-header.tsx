"use client";

import { MemberRole, Server } from "@prisma/client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ChevronDown, LogOut, PlusCircle, Trash, Users } from "lucide-react";
import InvitePeopleModal from "../modals/invite-people-modal";
import { ServerSettingModal } from "../modals/server-setting-modal";

interface SidebarHeaderProps {
  server: Server;
  role?: MemberRole;
}

export function SidebarHeader({ server, role }: SidebarHeaderProps) {
  const isAdmin = role === MemberRole.ADMIN;
  const isModerator = isAdmin || role === MemberRole.MODERATOR;

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
                onSelect={(e) => e.preventDefault()}
                className="cursor-pointer"
              >
                <InvitePeopleModal server={server} />
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                Create channel <PlusCircle className="ml-auto h-4 w-4" />
              </DropdownMenuItem>
            </>
          )}
          {isAdmin && (
            <>
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                className="cursor-pointer"
              >
                <ServerSettingModal defaultValues={server} />
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
