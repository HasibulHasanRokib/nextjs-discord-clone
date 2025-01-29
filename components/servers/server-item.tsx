"use client";

import Image from "next/image";
import React from "react";
import { TooltipAction } from "../tooltip-action";
import { useRouter } from "next/navigation";

interface ServerItemProps {
  id: string;
  name: string;
  imageUrl: string;
}
export function ServerItem({ id, imageUrl, name }: ServerItemProps) {
  const router = useRouter();

  return (
    <TooltipAction label={name} aline="center" side="right">
      <button type="button" onClick={() => router.push(`/server/${id}`)}>
        <div className="relative mx-3 flex h-12 w-12 overflow-hidden rounded-2xl">
          <Image
            fill
            src={imageUrl}
            alt="image"
            className="rounded-2xl object-cover"
          />
        </div>
      </button>
    </TooltipAction>
  );
}
