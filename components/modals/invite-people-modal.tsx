"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/store/modal-store";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";

export default function InvitePeopleModal() {
  const [copied, setCopied] = useState(false);
  const { isOpen, type, onClose, data } = useModal();
  const isModalOpen = isOpen && type === "invite-people";

  const baseUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://nextjs-discord-clone.vercel.app";

  const inviteUrl = `${baseUrl}/invite/${data.server?.inviteCode}`;

  const onHandleCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 5000);
  };

  return (
    <>
      <Dialog open={isModalOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl">Invite Friends</DialogTitle>
          </DialogHeader>
          <Label>Server invite link</Label>
          <div className="flex items-center space-x-2">
            <Input defaultValue={inviteUrl} className="bg-slate-100" />
            <Button variant={"outline"} onClick={onHandleCopy}>
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <DialogFooter></DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
