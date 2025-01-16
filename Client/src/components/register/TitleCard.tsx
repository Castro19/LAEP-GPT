import useIsMobile from "@/hooks/use-mobile";

// TitleCard.tsx
type TitleCardProps = {
  title: string;
  description: string;
};

const TitleCard = ({ title, description }: TitleCardProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="relative w-full h-full">
      {/* Subtle decorative SVGs */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none select-none overflow-hidden">
        <svg
          className="absolute w-[300px] h-[300px] text-slate-300 opacity-[0.03] top-[-50px] right-[-50px]"
          fill="currentColor"
          viewBox="0 0 512 512"
        >
          <path d="M0 0L512 128L512 0L0 0Z" />
        </svg>
        <svg
          className="absolute w-[200px] h-[200px] text-slate-300 opacity-[0.02] bottom-[-30px] left-[-30px]"
          fill="currentColor"
          viewBox="0 0 512 512"
        >
          <rect x="0" y="0" width="512" height="512" />
        </svg>
      </div>

      {/* Main content */}
      <div
        className={`${
          isMobile ? "w-full" : "w-full h-full"
        } relative z-10 flex flex-col justify-center items-start bg-gradient-to-br from-zinc-800/95 via-zinc-800 to-slate-800 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 text-white p-8 border-b border-slate-600/50`}
      >
        <div className="max-w-md">
          <h1 className="text-4xl font-bold mb-4">{title}</h1>
          <p className="text-lg text-slate-200/90">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default TitleCard;
