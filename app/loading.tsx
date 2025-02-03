import { Loader2 } from "lucide-react";

import React from "react";

export default function Loading() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex items-center gap-x-2">
        <Loader2 className="animate-spin text-primary" />
        <p className="text-center font-bold text-primary">Loading...</p>
      </div>
    </div>
  );
}
