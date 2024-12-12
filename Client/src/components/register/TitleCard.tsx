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
      className={`${isMobile ? "w-full" : "w-1/2"} p-8 flex flex-col justify-center items-start bg-gradient-to-b from-indigo-500 to-indigo-700 text-white ${
        isMobile ? "p-4" : ""
      }`}
    >
      <h1 className="text-4xl font-bold mb-3">{title}</h1>
      <p className="mb-5">{description}</p>
    </div>
  );
};

export default TitleCard;
