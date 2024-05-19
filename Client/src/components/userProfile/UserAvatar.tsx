import { Avatar, AvatarImage } from "@/components/ui/avatar";

interface UserAvatarProps {
  userPhoto: string | null;
}
export function UserAvatar({ userPhoto }: UserAvatarProps) {
  return (
    <div className="flex items-center relative bg-gray-50 dark:bg-gray-800 shadow-md">
      <Avatar className="w-10 h-10 rounded-full overflow-hidden">
        <AvatarImage
          src={userPhoto || "../../static/imgs/test.png"}
          alt="User Avatar"
        />
      </Avatar>
    </div>
  );
}

export default UserAvatar;
