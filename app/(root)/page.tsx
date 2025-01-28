import { db } from "@/lib/db";
import { InitialProfile } from "@/lib/initial-profile";
import { redirect } from "next/navigation";

export default async function Home() {
  const profile = await InitialProfile();

  const server = await db.server.findFirst({
    where: {
      member: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (server) {
    return redirect(`/servers/${server.id}`);
  }

  return <div>Create server</div>;
}
