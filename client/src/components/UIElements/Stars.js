import React, { useState } from "react";

const Stars = ({ rating, interactive = false, onRatingChange }) => {
  const [currentRating, setCurrentRating] = useState(rating || 0);

  const handleStarClick = (index) => {
    if (interactive) {
      setCurrentRating(index + 1);
      if (onRatingChange) {
        onRatingChange(index + 1);
      }
    }
  };

  const renderStars = () => {
    const fullStars = Math.floor(currentRating);
    const halfStar = currentRating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return [
      ...Array(fullStars).fill("fa-star"),
      ...(halfStar ? ["fa-star-half-o"] : []),
      ...Array(emptyStars).fill("fa-star-o"),
    ];
  };

  return renderStars().map((starType, index) => (
    <i
      key={index}
      className={`fa ${starType}`}
      style={{ color: "var(--yellow)", cursor: interactive ? "pointer" : "default" }}
      onClick={() => handleStarClick(index)}
    />
  ));
};

export default Stars;