import { Separator } from "@/components/ui/separator";
import { UserButton } from "@clerk/nextjs";
import { ModeToggle } from "../mode-toggle";
import { CurrentUser } from "@/lib/current-user";
import { redirect } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { db } from "@/lib/db";
import { ServerItem } from "./server-item";
import { CreateServerBtn } from "./create-server-btn";

export async function Sidebar() {
  const profile = await CurrentUser();
  if (!profile) return redirect("/");

  const servers = await db.server.findMany({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  return (
    <div className="flex h-screen flex-col items-center border-r py-3">
      <CreateServerBtn />
      <Separator className="my-2" />
      <ScrollArea className="flex-grow">
        {servers.map((server) => (
          <div key={server.id}>
            <ServerItem
              id={server.id}
              name={server.serverName}
              imageUrl={server.imageUrl}
            />
          </div>
        ))}
      </ScrollArea>
      <div className="flex flex-col items-center space-y-4">
        <ModeToggle />
        <UserButton
          afterSwitchSessionUrl="/sign-in"
          appearance={{
            elements: {
              avatarBox: "h-[40px] w-[40px]",
            },
          }}
        />
      </div>
    </div>
  );
}
