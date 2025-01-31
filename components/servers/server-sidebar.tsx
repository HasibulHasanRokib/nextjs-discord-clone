import { CurrentUser } from "@/lib/current-user";
import { SidebarHeader } from "./sidebar-header";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

export async function ServerSidebar({ serverId }: { serverId: string }) {
  const profile = await CurrentUser();
  if (!profile) return redirect("/");

  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      members: true,
      channels: true,
    },
  });

  const role = server?.members.find(
    (member) => member.profileId === profile.id,
  )?.role;

  if (!server) return redirect("/");

  return (
    <div className="w-60 bg-slate-50">
      <SidebarHeader server={server} role={role} />
    </div>
  );
}
