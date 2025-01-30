import { ServerSidebar } from "@/components/servers/server-sidebar";
import { CurrentUser } from "@/lib/current-user";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import React from "react";

export default async function ServerIdPageLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ serverId: string }>;
}) {
  const serverId = (await params).serverId;
  const profile = await CurrentUser();

  if (!profile) return redirect("/");

  const server = await db.server.findUnique({
    where: {
      id: serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });
  if (!server) return redirect("/");

  return (
    <div className="flex h-screen">
      <ServerSidebar serverId={serverId} />
      <div className="flex-grow border-l px-3">{children}</div>
    </div>
  );
}
