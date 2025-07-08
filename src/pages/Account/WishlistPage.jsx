// WishlistPage.jsx
import React, { useState } from "react";
import { FaTrash } from "react-icons/fa";

const sampleWishlist = [
  {
    id: 1,
    title: "Morning Yoga Flow",
    trainer: "Anjali Sharma",
    time: "6:00 AM",
    image:
      "https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: 2,
    title: "Strength Training",
    trainer: "Ravi Kumar",
    time: "7:30 AM",
    image:
      "https://images.pexels.com/photos/1552108/pexels-photo-1552108.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: 3,
    title: "Cardio Blast",
    trainer: "Simran Kaur",
    time: "5:00 PM",
    image:
      "https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
];

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState(sampleWishlist);

  const removeFromWishlist = (id) => {
    setWishlist(wishlist.filter((item) => item.id !== id));
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
            My Wishlist
          </h2>

          {wishlist.length === 0 ? (
            <p className="text-center text-gray-600">
              No items in your wishlist.
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {wishlist.map((item) => (
                <div
                  key={item.id}
                  className="bg-white shadow-md rounded-2xl overflow-hidden relative"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Trainer: {item.trainer}
                    </p>
                    <p className="text-sm text-gray-500">Time: {item.time}</p>
                  </div>
                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow"
                  >
                    <FaTrash size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default WishlistPage;
