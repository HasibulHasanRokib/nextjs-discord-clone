"use server";
import { UTApi } from "uploadthing/server";

export async function removeImage(url: string) {
  try {
    const utapi = new UTApi();
    await utapi.deleteFiles(url);

    return { success: true };
  } catch (error) {
    return { error };
  }
}
