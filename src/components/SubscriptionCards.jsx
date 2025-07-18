import { FaStar } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import RatingStars from "./RatingStars";

const getInitials = (name) => {
  if (!name) return "NA";
  const words = name.split(" ");
  return words
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
};

const getColorClass = (index) => {
  const colors = [
    "bg-indigo-100 text-indigo-800",
    "bg-pink-100 text-pink-800",
    "bg-teal-100 text-teal-800",
  ];
  return colors[index % 3];
};

const formatPrice = (price) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "AED",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

const SubscriptionCards = ({
  _id,
  media,
  categoryId,
  price,
  name,
  description,
  startTime,
  endTime,
  trainer,
  averageRating,
  totalReviews,
  fromSection,
}) => {
  const hasImage = Boolean(media);
  const initials = getInitials(name);
  const colorClass = getColorClass(Math.floor(Math.random() * 3));
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/sessions/${_id}`, { state: { fromSection } });
  };

  return (
    <div
      onClick={() => handleNavigate()}
      className="bg-white rounded-xl cursor-pointer shadow-md overflow-hidden w-72 flex-shrink-0 transition-all duration-200 hover:shadow-lg"
    >
      {hasImage ? (
        <img
          src={media}
          alt={name}
          className="w-full h-36 object-cover object-center"
        />
      ) : (
        <div
          className={`w-full h-36 flex items-center justify-center ${colorClass} text-4xl font-bold`}
        >
          {initials}
        </div>
      )}
      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <span className="uppercase text-xs font-bold tracking-widest text-pink-600 bg-pink-50 px-2 py-0.5 rounded-full">
            {categoryId?.cName}
          </span>
          <span className="text-lg font-bold text-gray-900">
            {formatPrice(price)}
          </span>
        </div>

        <h3 className="font-semibold text-lg mb-1 capitalize text-gray-800 line-clamp-1">
          {name}
        </h3>

        <div className="text-sm text-gray-600 mb-2 line-clamp-2 h-[40px]">
          {description}
        </div>

        <div className="flex items-center text-xs text-gray-500 mb-2">
          <svg
            className="w-3 h-3 mr-1 text-pink-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {startTime} - {endTime} w/ {trainer?.first_name} {trainer?.last_name}
        </div>

        <div className="flex items-center">
          <RatingStars rating={averageRating} totalReviews={totalReviews} />
        </div>
      </div>
    </div>
  );
};

export default SubscriptionCards;
