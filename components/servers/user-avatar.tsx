import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function UserAvatar({ url }: { url?: string }) {
  return (
    <div>
      <Avatar>
        <AvatarImage src={url} />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    </div>
  );
}
