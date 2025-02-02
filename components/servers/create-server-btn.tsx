"use client";
import React from "react";
import { TooltipAction } from "../tooltip-action";
import { Plus } from "lucide-react";
import { useModal } from "@/store/use-modal-store";

export default function CreateServerBtn() {
  const { onOpen } = useModal();
  return (
    <TooltipAction label="Create server" side="right" aline="center">
      <button
        onClick={() => onOpen("create-modal")}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white hover:opacity-80"
      >
        <Plus />
      </button>
    </TooltipAction>
  );
}
