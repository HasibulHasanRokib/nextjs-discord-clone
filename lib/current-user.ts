import { auth } from "@clerk/nextjs/server";
import { db } from "./db";

export const CurrentUser = async () => {
  const { userId } = await auth();

  if (!userId) return null;

  const currentProfile = await db.profile.findFirst({
    where: {
      userId,
    },
  });

  return currentProfile;
};
