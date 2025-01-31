import { CurrentUser } from "@/lib/current-user";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function InviteCodePage({
  params,
}: {
  params: Promise<{ inviteCode: string }>;
}) {
  const inviteCode = (await params).inviteCode;

  const profile = await CurrentUser();
  if (!profile) return redirect("/");

  const serverExist = await db.server.findFirst({
    where: {
      inviteCode,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (serverExist) return redirect(`/server/${serverExist.id}`);

  const server = await db.server.update({
    where: { inviteCode },
    data: {
      members: {
        create: [
          {
            profileId: profile.id,
          },
        ],
      },
    },
  });

  if (server) return redirect(`/server/${server.id}`);

  return null;
}
