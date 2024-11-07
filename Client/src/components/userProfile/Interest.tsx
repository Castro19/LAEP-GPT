import { useAppSelector } from "@/redux";

const Interest = () => {
  const { userData } = useAppSelector((state) => state.user);

  // Sort the interests alphabetically
  const interests = userData?.interests?.slice().sort() ?? [];

  return (
    <div>
      {interests.length > 0 ? (
        <div className="flex flex-wrap justify-center mt-2">
          {interests.map((interest, index) => (
            <span
              key={index}
              className="m-1 px-3 py-1 rounded-full bg-gray-600 text-white text-sm transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 hover:bg-gray-500"
            >
              {interest}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-lg text-center">N/A</p>
      )}
    </div>
  );
};

export default Interest;
