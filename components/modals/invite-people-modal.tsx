"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Check, Copy, UserPlus } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Server } from "@prisma/client";

export default function InvitePeopleModal({ server }: { server: Server }) {
  const [copied, setCopied] = useState(false);

  const baseUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://nextjs-discord-clone.vercel.app";

  const inviteUrl = `${baseUrl}/invite/${server?.inviteCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 5000);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex w-full items-center justify-between">
          Invite People
          <UserPlus className="h-4 w-4" />
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite people link</DialogTitle>
          <DialogDescription>
            Anyone who has this link will be able to joi this server.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input id="link" defaultValue={inviteUrl} readOnly />
          </div>
          <Button onClick={handleCopy} type="submit" size="sm" className="px-3">
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
