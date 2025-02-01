import { Server, Member, Profile, Channel } from "@prisma/client";
export type ServerWithMemberWithProfile = Server & {
  members: (Member & { Profile: Profile | null })[];
  channels: Channel[];
};
