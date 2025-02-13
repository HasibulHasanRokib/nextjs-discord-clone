"use client";

import { deleteServerAction } from "@/actions/server-actions";
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

export default function DeleteServerModal() {
  const router = useRouter();
  const { isOpen, onClose, data, type } = useModal();

  const isModalOpen = isOpen && type === "delete-server";
  const { server } = data;

  const { mutate, isPending } = useMutation({
    mutationKey: ["delete-server"],
    mutationFn: deleteServerAction,
    onSuccess: (data) => {
      if (data.success) {
        router.refresh();
      }
    },
  });
  if (!server) return null;

  return (
    <AlertDialog open={isModalOpen} onOpenChange={() => onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this{" "}
            <span className="font-semibold capitalize text-primary">
              {server?.serverName}
            </span>{" "}
            server.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => mutate(server.id)}>
            {isPending ? <Spinner /> : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
