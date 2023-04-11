import React from "react";

const Stars = props => {
  const renderStars = () => {
    const fullStars = Math.floor(props.rating);
    const halfStar = props.rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    return [
      ...Array(fullStars).fill("fa-star"),
      ...(halfStar ? ["fa-star-half-o"] : []),
      ...Array(emptyStars).fill("fa-star-o"),
    ];
  };
  return (renderStars().map((starType, index) => (
    <i key={index} className={`fa ${starType}`} style={{color: "var(--yellow)"}} />
  )));
}

export default Stars;
