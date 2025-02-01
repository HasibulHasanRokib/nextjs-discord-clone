"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ScrollArea } from "@/components/ui/scroll-area";

import { ServerWithMemberWithProfile } from "@/lib/types";
import {
  Check,
  MoreVertical,
  ShieldAlert,
  ShieldCheck,
  UserMinus,
  Users,
} from "lucide-react";
import { UserAvatar } from "../servers/user-avatar";
import { MemberRole } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { updateUserRole } from "@/actions/server-actions";
import { useRouter } from "next/navigation";
import { ErrorMessage } from "../error-message";
import { SuccessMessage } from "../success-message";
import { useState } from "react";

const ROLEMAP = {
  GUEST: null,
  MODERATOR: <ShieldCheck className="h-4 w-4 text-primary" />,
  ADMIN: <ShieldAlert className="h-4 w-4 text-destructive" />,
  KICK: null,
};

export default function ManageMembersModal({
  server,
}: {
  server: ServerWithMemberWithProfile;
}) {
  const router = useRouter();
  const [showMessage, setShowMessage] = useState<boolean>(false);
  const { mutate, data } = useMutation({
    mutationKey: ["update-user-role"],
    mutationFn: updateUserRole,
    onSuccess: (data) => {
      if (data) {
        setShowMessage(true);
        router.refresh();
      }
      setTimeout(() => {
        setShowMessage(false);
      }, 2000);
    },
  });

  const handleChange = (memberId: string, newRole: MemberRole) => {
    mutate({ memberId, newRole, serverId: server.id });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex w-full items-center justify-between">
          Manage Members
          <Users className="h-4 w-4" />
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">
            Manage Members
          </DialogTitle>
          <DialogDescription className="text-center">
            {server.members.length} Members
          </DialogDescription>
        </DialogHeader>
        <div>
          {showMessage && data?.error && <ErrorMessage message={data.error} />}
          {showMessage && data?.success && (
            <SuccessMessage message={data.success} />
          )}
        </div>
        <div>
          <ScrollArea className="max-h-[420px] p-2">
            {server?.members?.map((member) => (
              <div key={member.id} className="mb-6 flex items-center gap-x-3">
                <UserAvatar url={member.Profile?.imageUrl} />
                <div className="flex flex-col gap-y-1">
                  <div className="flex items-center gap-x-2 text-xs font-semibold capitalize">
                    {member.Profile?.name}
                    {ROLEMAP[member.role]}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {member.Profile?.email}
                  </p>
                </div>
                {member.id && member.role !== "ADMIN" && (
                  <div className="ml-auto">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <MoreVertical className="h-4 w-4 text-muted-foreground" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="right">
                        <DropdownMenuLabel>Select role</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleChange(member.id, "GUEST")}
                        >
                          Guest{" "}
                          {member.role === "GUEST" ? (
                            <Check className="ml-auto text-primary" />
                          ) : (
                            ""
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleChange(member.id, "MODERATOR")}
                        >
                          Moderator{" "}
                          {member.role === "MODERATOR" ? (
                            <Check className="ml-auto text-primary" />
                          ) : (
                            ""
                          )}
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleChange(member.id, "KICK")}
                        >
                          <UserMinus />
                          <span>Kick</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              </div>
            ))}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
