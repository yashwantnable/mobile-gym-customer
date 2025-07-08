// SessionCards.jsx
import React from "react";
import { FaStar } from "react-icons/fa";
import { IoLocationOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { sessions } from "./dummyData";

const MySessionPage = () => {
  return (
    <>
      <div className="  rounded-xl  p-6 w-full mx-auto max-w-7xl h-[100vh]">
        <h2 className="text-2xl font-bold mb-6 text-center">My Sessions</h2>

        <div className="flex flex-wrap justify-center gap-6">
          {sessions.map((session, index) => (
            <Link
              key={index}
              to={`/my-session/${index}`}
              className="bg-white rounded-xl shadow-sm overflow-hidden w-full sm:w-[48%] lg:w-[30%]"
            >
              <img
                src={session.image}
                alt={session.title}
                className="h-48 w-full object-cover"
              />
              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">{session.title}</h3>
                  <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                    {session.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-4">
                  with {session.trainer}
                </p>
                <div className="flex justify-between text-sm text-gray-600 flex-wrap gap-2">
                  <span>{session.time}</span>
                  <span className="flex items-center gap-1">
                    <IoLocationOutline className="text-lg" />
                    {session.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaStar className="text-yellow-400" />
                    {session.rating}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default MySessionPage;
