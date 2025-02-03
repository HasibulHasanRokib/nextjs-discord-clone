import { ServerRootSidebar } from "@/components/servers/server-root-sidebar";
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
      <ServerRootSidebar />
      <ServerSidebar serverId={serverId} />
      {children}
    </div>
  );
}
