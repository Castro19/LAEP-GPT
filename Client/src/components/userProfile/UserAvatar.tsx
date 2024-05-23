import { Avatar, AvatarImage } from "@/components/ui/avatar";
import defaultPhoto from "/imgs/test.png";

interface UserAvatarProps {
  userPhoto: string | null;
}
export function UserAvatar({ userPhoto }: UserAvatarProps) {
  return (
    <div>
      <Avatar className="w-10 h-10 rounded-full overflow-hidden">
        <AvatarImage src={userPhoto || defaultPhoto} alt="User Avatar" />
      </Avatar>
    </div>
  );
}

export default UserAvatar;
