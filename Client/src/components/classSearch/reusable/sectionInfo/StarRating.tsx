import { ProfessorGroup } from "@polylink/shared/types";

interface StarRatingProps {
  group: ProfessorGroup;
  isNarrowScreen?: boolean;
  strokeColor?: string;
}

interface StarProps {
  fillPercentage: number; // A value between 0 (empty) and 1 (full)
  isNarrowScreen?: boolean;
  strokeColor?: string;
}

// A Star component that renders an SVG star with a filled overlay.
export const Star: React.FC<StarProps> = ({
  fillPercentage,
  isNarrowScreen = false,
  strokeColor = "white",
}) => {
  const starSize = isNarrowScreen ? 14 : 18;
  const svgSize = isNarrowScreen ? 12 : 16;
  const marginRight = isNarrowScreen ? 1 : 2;

  return (
    <div
      style={{
        position: "relative",
        display: "inline-block",
        width: `${starSize}px`,
        height: `${starSize}px`,
        marginRight: `${marginRight}px`,
      }}
    >
      {/* The empty star (background) */}
      <svg
        viewBox="0 0 24 24"
        width={svgSize}
        height={svgSize}
        fill="none"
        stroke={strokeColor}
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
          width={svgSize}
          height={svgSize}
          fill="white"
          stroke={strokeColor}
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="12 2 15 8.5 22 9 17 14 18 21 12 18 6 21 7 14 2 9 9 8.5" />
        </svg>
      </div>
    </div>
  );
};

const StarRating: React.FC<StarRatingProps> = ({
  group,
  isNarrowScreen = false,
}) => {
  const totalStars = 4;

  // Calculate the fill level for each star:
  // For each star (indexed 0 to 3), the fill is:
  //   fill = clamp(overallRating - index, 0, 1)
  const stars = Array.from({ length: totalStars }, (_, index) => {
    const fillPercentage = Math.max(
      0,
      Math.min(1, group.overallRating - index)
    );
    return (
      <Star
        key={index}
        fillPercentage={fillPercentage}
        isNarrowScreen={isNarrowScreen}
      />
    );
  });

  return (
    <div className="flex items-center gap-1 font-sans">
      <div className="flex items-center">{stars}</div>
    </div>
  );
};

export default StarRating;
