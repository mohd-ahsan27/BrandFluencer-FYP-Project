// src/pages/Explore/components/Stars.jsx
import React from "react";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";

export default function Stars({ value = 0, className = "" }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (value >= i) stars.push(<FaStar key={i} />);
    else if (value >= i - 0.5) stars.push(<FaStarHalfAlt key={i} />);
    else stars.push(<FaRegStar key={i} />);
  }

  return (
    <div className={`flex items-center gap-1 text-amber-500 ${className}`}>
      {stars}
    </div>
  );
}