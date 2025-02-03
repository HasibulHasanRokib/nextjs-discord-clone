import { Member, Profile } from "@prisma/client";
import React from "react";
import { UserAvatar } from "../user-avatar";
interface ServerMemberProps {
  member: Member & { Profile: Profile | null };
}

export function ServerMember({ member }: ServerMemberProps) {
  return (
    <div className="flex items-center gap-x-2 p-2">
      <UserAvatar className="h-5 w-5" url={member.Profile?.imageUrl} />
      <p className="text-sm text-muted-foreground"> {member.Profile?.name}</p>
    </div>
  );
}
