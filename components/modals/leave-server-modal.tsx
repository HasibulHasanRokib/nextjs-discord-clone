"use client";

import { leaveServerAction } from "@/actions/server-actions";
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

export default function LeaveServerModal() {
  const router = useRouter();
  const { isOpen, onClose, data, type } = useModal();

  const isModalOpen = isOpen && type === "leave-server";
  const { server } = data;

  const { mutate } = useMutation({
    mutationKey: ["leave-server"],
    mutationFn: leaveServerAction,
    onSuccess: (data) => {
      if (data.success) {
        router.push("/");
        onClose();
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
            This action cannot be undone. This will permanently delete you from{" "}
            <span className="font-semibold capitalize">
              {server?.serverName}
            </span>{" "}
            server.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => mutate(server.id)}>
            Leave
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
