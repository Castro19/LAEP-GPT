import { Avatar, AvatarImage } from "@/components/ui/avatar";

interface UserAvatarProps {
  userPhoto: string | undefined;
}
export function UserAvatar({ userPhoto }: UserAvatarProps) {
  return (
    <div>
      <Avatar className="w-10 h-10 rounded-full overflow-hidden">
        <AvatarImage src={userPhoto || "/imgs/test.png"} alt="User Avatar" />
      </Avatar>
    </div>
  );
}

export default UserAvatar;
