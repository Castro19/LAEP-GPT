// TitleCard.tsx
import React from "react";
import { useNavigate } from "react-router-dom";

const TitleCard = () => {
  const navigate = useNavigate();

  return (
    <div className="w-1/2 p-8 flex flex-col justify-center items-start bg-gradient-to-b from-indigo-500 to-indigo-700 text-white">
      <h1 className="text-4xl font-bold mb-3">Welcome!</h1>
      <p className="mb-5">
        Sign in & get access to additional features such as saving completed
        schedules, ...
      </p>
      <button
        onClick={() => navigate("/")}
        className="py-2 px-4 bg-white text-indigo-700 font-semibold rounded-lg shadow-md hover:bg-indigo-100"
      >
        I'll sign up another time
      </button>
    </div>
  );
};

export default TitleCard;
