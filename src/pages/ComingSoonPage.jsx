import React from "react";
import { FiClock } from "react-icons/fi";
import { Link } from "react-router-dom";

const ComingSoonPage = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-primary to-[#e2e8f0] px-4">
      <div className="text-center animate-fade-in-up">
        <div className="flex justify-center mb-6">
          <FiClock size={60} className="text-third" />
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Coming Soon!
        </h1>

        <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-xl mx-auto">
          We're working hard to bring this feature to life. Stay tuned — great things are on the way!
        </p>

        <Link
          to="/"
          className="inline-block px-6 py-3 bg-third text-white text-lg font-medium rounded-lg shadow-md hover:bg-third/90 transition-all duration-200"
        >
          Explore
        </Link>
      </div>
    </div>
  );
};

export default ComingSoonPage;
