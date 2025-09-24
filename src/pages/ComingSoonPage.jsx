import React from "react";
import { FiClock } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";

const ComingSoonPage = () => {
   const { lightMode } = useTheme();
  return (
    <div className={`flex items-center justify-center h-screen bg-gradient-to-br ${lightMode?"from-primary to-[#e2e8f0]":""} px-4`}>
      <div className="text-center animate-fade-in-up">
        <div className="flex justify-center mb-6">
          <FiClock size={60} className={`${lightMode?"text-third":"text-white"}`} />
        </div>

        <h1 className={`text-4xl md:text-5xl font-bold ${lightMode?"text-gray-800":"text-white"} mb-4`}>
          Coming Soon!
        </h1>

        <p className={`text-lg md:text-xl  ${lightMode?"text-gray-800":"text-gray-300"} mb-8 max-w-xl mx-auto`}>
          We're working hard to bring this feature to life. Stay tuned — great things are on the way!
        </p>

        <Link
          to="/"
          className={`inline-block px-6 py-3 ${lightMode?"bg-third text-white hover:bg-third/90":"bg-white text-third hover:shadow-white"} text-lg font-medium rounded-lg shadow-md  transition-all duration-200`}
        >
          Explore
        </Link>
      </div>
    </div>
  );
};

export default ComingSoonPage;
