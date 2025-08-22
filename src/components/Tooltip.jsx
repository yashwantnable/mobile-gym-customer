import React from "react";

const Tooltip = ({ text }) => {
  if (!text) return null;

  return (
    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-48 p-3 bg-third text-primary text-sm rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-10">
      <p className="text-center">{text}</p>
      {/* Tooltip arrow */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-b-third"></div>
    </div>
  );
};

export default Tooltip;
