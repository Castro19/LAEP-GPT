// TitleCard.tsx
type TitleCardProps = {
  title: string;
  description: string;
};

const TitleCard = ({ title, description }: TitleCardProps) => {
  return (
    <div className="w-1/2 p-8 flex flex-col justify-center items-start bg-gradient-to-b from-indigo-500 to-indigo-700 text-white">
      <h1 className="text-4xl font-bold mb-3">{title}</h1>
      <p className="mb-5">{description}</p>
    </div>
  );
};

export default TitleCard;
