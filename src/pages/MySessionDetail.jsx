import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { sessions } from "./dummyData";

const MySessionDetail = () => {
  const { id } = useParams();
  const session = sessions.find((s) => s.id === Number(id));
  const [menuOpen, setMenuOpen] = useState(false);

  if (!session) {
    return (
      <div className="p-8 text-center max-w-4xl mx-auto h-[92vh] flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl w-full h-[50%] flex justify-center items-center">
          <div className="text-center">
            <img
              src="https://www.svgrepo.com/show/34869/one-dumbbell.svg"
              alt="No Session"
              className="mx-auto h-20 mb-4"
            />
            <h3 className="text-red-600 text-2xl mb-2">
              You have not joined any session
            </h3>
            <Link
              to="/my-sessions"
              className="text-primary cursor-pointer text-xl hover:underline"
            >
              Join session now
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleCancel = () => {
    setMenuOpen(false);
    alert(`You have canceled your subscription to "${session.title}".`);
    // Place your cancel subscription logic here
  };

  return (
    <div className="p-8 max-w-3xl mx-auto h-[92vh]">
      <div className="bg-white p-4 rounded-xl relative shadow">
        {/* Session Details */}
        <img
          src={session.image}
          alt={session.title}
          className="w-full h-64 object-cover rounded-xl mb-6 shadow-lg"
        />

        {/* Three-dot Menu */}
        <div className="absolute right-4 z-10">
          <button
            className="text-gray-600 hover:text-gray-900 text-2xl"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            ⋮
          </button>

          {menuOpen && (
            <div className="mt-2 bg-white shadow-md rounded border w-48 absolute right-0">
              <button
                onClick={handleCancel}
                className="w-full text-left px-4 py-2 hover:bg-red-100 text-red-600"
              >
                Cancel Subscription
              </button>
            </div>
          )}
        </div>
        <h1 className="text-3xl font-bold mb-2">{session.title}</h1>
        <p className="text-lg text-gray-600 mb-4">with {session.trainer}</p>

        <div className="flex flex-wrap gap-4 mb-4 text-sm">
          <span>
            🕒 <strong>{session.time}</strong>
          </span>
          <span>
            ⏳ Duration: <strong>{session.duration}</strong>
          </span>
          <span>
            📍 Location: <strong>{session.location}</strong>
          </span>
          <span>
            🔥 Intensity: <strong>{session.intensity}</strong>
          </span>
          <span>
            ⭐ Rating: <strong>{session.rating}</strong>
          </span>
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
            {session.status}
          </span>
        </div>

        <p className="mb-6">{session.description}</p>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Equipment Needed</h2>
          <ul className="list-disc list-inside text-gray-700">
            {session.equipment.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Benefits</h2>
          <ul className="list-disc list-inside text-gray-700">
            {session.benefits.map((benefit, index) => (
              <li key={index}>{benefit}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MySessionDetail;
