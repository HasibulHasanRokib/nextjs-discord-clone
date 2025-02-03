"use client";

import { deleteChannelAction } from "@/actions/channel-actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { useModal } from "@/store/use-modal-store";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Spinner } from "../spinner";

export default function DeleteChannelModal() {
  const router = useRouter();
  const { isOpen, onClose, data, type } = useModal();

  const isModalOpen = isOpen && type === "delete-channel";
  const { server, channel } = data;

  const { mutate, isPending } = useMutation({
    mutationKey: ["delete-channel"],
    mutationFn: deleteChannelAction,
    onSuccess: (data) => {
      if (data) {
        router.refresh();
      }
    },
  });
  if (!server) return null;
  if (!channel) return null;

  return (
    <AlertDialog open={isModalOpen} onOpenChange={() => onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your{" "}
            <span className="font-semibold capitalize text-primary">
              {channel?.channelName}
            </span>{" "}
            channel.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() =>
              mutate({ serverId: server.id, channelId: channel.id })
            }
          >
            {isPending ? <Spinner /> : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
