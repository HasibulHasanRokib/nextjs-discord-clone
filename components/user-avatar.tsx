import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export function UserAvatar({
  url,
  className,
}: {
  url?: string;
  className?: ReactNode;
}) {
  return (
    <Avatar className={cn(className)}>
      <AvatarImage src={url} />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  );
}
