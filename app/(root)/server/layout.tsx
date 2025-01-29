import { Sidebar } from "@/components/servers/sidebar";
import React from "react";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <div className="w-[4rem]">
        <Sidebar />
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}
