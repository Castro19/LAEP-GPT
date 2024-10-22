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
      {/* LEGACY GUEST SIGN IN BUTTON
      <button
        onClick={() => navigate("/")}
        className="py-2 px-4 bg-white text-indigo-700 font-semibold rounded-lg shadow-md hover:bg-indigo-100"
      >
        I will sign up another time
      </button> */}
    </div>
  );
};

export default TitleCard;
