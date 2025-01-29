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
        className="rounded-full bg-primary p-2 text-white hover:opacity-70"
      >
        <Plus />
      </button>
    </TooltipAction>
  );
}
