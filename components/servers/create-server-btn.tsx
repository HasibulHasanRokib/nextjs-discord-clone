"use client";

import { Plus } from "lucide-react";
import { TooltipAction } from "../tooltip-action";
import { useModal } from "@/store/modal-store";

export function CreateServerBtn() {
  const { onOpen } = useModal();
  return (
    <TooltipAction label="Create server" side="right" aline="center">
      <button
        onClick={() => onOpen("create-servers")}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white hover:opacity-80"
      >
        <Plus />
      </button>
    </TooltipAction>
  );
}
