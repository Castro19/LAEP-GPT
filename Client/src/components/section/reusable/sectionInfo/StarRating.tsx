import React from "react";

interface StarRatingProps {
  overallRating: number;
  size?: number;
}

interface StarProps {
  fillPercentage: number; // A value between 0 (empty) and 1 (full)
  size?: number;
}

// A Star component that renders an SVG star with a filled overlay.
export const Star: React.FC<StarProps> = ({ fillPercentage, size = 22 }) => {
  const scale = size === 16 ? 0.67 : 1;
  const viewBox = "0 0 24 24";
  const strokeWidth = size === 16 ? "1.5" : "2";
  const marginRight = size === 16 ? "3" : "4";

  // Scale the polygon points based on size
  const points = [
    [12, 2], // top
    [15, 8.5], // right upper
    [22, 9], // right point
    [17, 14], // right lower
    [18, 21], // bottom right
    [12, 18], // bottom middle
    [6, 21], // bottom left
    [7, 14], // left lower
    [2, 9], // left point
    [9, 8.5], // left upper
  ]
    .map(([x, y]) => [
      x * scale + (size === 16 ? 4 : 0),
      y * scale + (size === 16 ? 0.75 : 0),
    ])
    .join(" ");

  return (
    <div
      style={{
        position: "relative",
        display: "inline-block",
        width: size,
        height: size,
        marginRight: marginRight,
      }}
    >
      {/* The empty star (background) */}
      <svg
        viewBox={viewBox}
        width={size}
        height={size}
        fill="none"
        stroke="#ccc"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points={points} />
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
          viewBox={viewBox}
          width={size}
          height={size}
          fill="white"
          stroke="white"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points={points} />
        </svg>
      </div>
    </div>
  );
};

const StarRating: React.FC<StarRatingProps> = ({
  overallRating,
  size = 22,
}) => {
  const totalStars = 4;

  // Calculate the fill level for each star:
  // For each star (indexed 0 to 3), the fill is:
  //   fill = clamp(overallRating - index, 0, 1)
  const stars = Array.from({ length: totalStars }, (_, index) => {
    const fillPercentage = Math.max(0, Math.min(1, overallRating - index));
    return <Star key={index} fillPercentage={fillPercentage} size={size} />;
  });

  return (
    <div className="flex items-center gap-2 font-sans">
      <div className="flex items-center">{stars}</div>
    </div>
  );
};

export default StarRating;
