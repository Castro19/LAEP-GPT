// TitleCard.tsx

const TitleCard = () => {
  return (
    <div className="w-1/2 p-8 flex flex-col justify-center items-start bg-gradient-to-b from-indigo-500 to-indigo-700 text-white">
      <h1 className="text-4xl font-bold mb-3">Welcome!</h1>
      <p className="mb-5">Sign in & get access to the AI4ESJ Chatbot!</p>
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
