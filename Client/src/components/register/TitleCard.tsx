import useIsMobile from "@/hooks/use-mobile";

// TitleCard.tsx
type TitleCardProps = {
  title: string;
  description: string;
};

const TitleCard = ({ title, description }: TitleCardProps) => {
  const isMobile = useIsMobile();

  return (
    <div
      className={`${
        isMobile ? "w-full" : "w-full h-full"
      } flex flex-col justify-center items-start bg-gradient-to-b from-indigo-500 to-indigo-700 text-white p-8`}
    >
      <div className="max-w-md">
        <h1 className="text-4xl font-bold mb-4">{title}</h1>
        <p className="text-lg opacity-90">{description}</p>
      </div>
    </div>
  );
};

export default TitleCard;
