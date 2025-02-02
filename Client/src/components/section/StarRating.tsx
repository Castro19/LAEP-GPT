import React from "react";
import { ProfessorGroup } from "@polylink/shared/types";

interface StarRatingProps {
  group: ProfessorGroup;
}

interface StarProps {
  fillPercentage: number; // A value between 0 (empty) and 1 (full)
}

// A Star component that renders an SVG star with a filled overlay.
const Star: React.FC<StarProps> = ({ fillPercentage }) => {
  return (
    <div
      style={{
        position: "relative",
        display: "inline-block",
        width: "24px",
        height: "24px",
        marginRight: "4px",
      }}
    >
      {/* The empty star (background) */}
      <svg
        viewBox="0 0 24 24"
        width="24"
        height="24"
        fill="none"
        stroke="#ccc"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="12 2 15 8.5 22 9 17 14 18 21 12 18 6 21 7 14 2 9 9 8.5" />
      </svg>
      {/* The filled star overlay, clipped to the fill percentage */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: `${fillPercentage * 100}%`,
          overflow: "hidden",
        }}
      >
        <svg
          viewBox="0 0 24 24"
          width="24"
          height="24"
          fill="gold"
          stroke="gold"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="12 2 15 8.5 22 9 17 14 18 21 12 18 6 21 7 14 2 9 9 8.5" />
        </svg>
      </div>
    </div>
  );
};

const StarRating: React.FC<StarRatingProps> = ({ group }) => {
  const totalStars = 4;

  // Calculate the fill level for each star:
  // For each star (indexed 0 to 3), the fill is:
  //   fill = clamp(overallRating - index, 0, 1)
  const stars = Array.from({ length: totalStars }, (_, index) => {
    const fillPercentage = Math.max(
      0,
      Math.min(1, group.overallRating - index)
    );
    return <Star key={index} fillPercentage={fillPercentage} />;
  });

  return (
    <div className="flex items-center gap-2 font-sans">
      <div className="flex items-center">{stars}</div>
      <div className="text-sm text-slate-300">
        <strong>{group.overallRating.toFixed(1)}</strong> / 4
        <span className="ml-1 text-slate-500">
          ({group.instructor.numEvals} evals)
        </span>
      </div>
    </div>
  );
};

export default StarRating;
