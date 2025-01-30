"use client";

import { removeImage } from "@/lib/remove-image";
import { UploadDropzone } from "@/lib/uploadthing";
import { X } from "lucide-react";
import Image from "next/image";

interface FileUploadProps {
  value: string;
  endpoint: "serverImage" | "messageFile";
  onChange: (url: string) => void;
}

export function FileUpload({ value, endpoint, onChange }: FileUploadProps) {
  const removeFile = async (url: string) => {
    const res = await removeImage(url);
    if (res.success) {
      onChange("");
    }
  };

  if (value) {
    return (
      <div className="flex flex-col items-center">
        <div className="relative h-20 w-20">
          <Image
            fill
            src={value}
            alt="server image"
            className="rounded-full object-cover"
          />
          <button
            type="button"
            className="absolute right-0 top-0 rounded-full bg-destructive p-1 text-white"
            onClick={() => removeFile(value)}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <UploadDropzone
        endpoint={endpoint}
        onClientUploadComplete={(res) => onChange(res[0].url)}
        onUploadError={(error: Error) => {
          alert(`ERROR! ${error.message}`);
        }}
      />
    </div>
  );
}
