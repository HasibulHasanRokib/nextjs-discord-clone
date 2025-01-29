import { CreateServerForm } from "@/components/modal/createServerForm";
import { db } from "@/lib/db";
import { InitialProfile } from "@/lib/initial-profile";
import { UserButton } from "@clerk/nextjs";
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
    return redirect(`/server/${server.id}`);
  }

  return (
    <div>
      <CreateServerForm />
      <UserButton />
    </div>
  );
}
