const ProfileBio = ({ bio }: { bio: string; handleSave: () => void }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="flex items-center justify-center">
        <p className="text-2xl text-center font-inter text-gray-500 leading-relaxed tracking-tight italic px-4">
          &quot;{bio || "Write something about yourself..."}&quot;
        </p>
      </div>
    </div>
  );
};

export default ProfileBio;
