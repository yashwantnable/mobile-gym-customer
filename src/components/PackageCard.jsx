import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBrandColor } from "../contexts/BrandColorContext";

const PackageCard = ({
  image,
  name,
  price,
  numberOfClasses,
  duration,
  features = [],
  packageData,
  isPurchased = false,
}) => {
  const style = {
    bg: "bg-primary",
    border: "border-fifth",
    button: "bg-fourth hover:bg-fifth",
    text: "text-third",
    accent: "bg-sixth",
  };
  const navigate = useNavigate();

  // Feature pagination state
  const { brandColor } = useBrandColor();
  const [visibleCount, setVisibleCount] = useState(3);
  const totalFeatures = features.length;
  const canShowMore = visibleCount < totalFeatures;
  const canShowLess = visibleCount > 3;

  const handleShowMore = () => {
    setVisibleCount((prev) => Math.min(prev + 3, totalFeatures));
  };
  const handleShowLess = () => {
    setVisibleCount(3);
  };

  const handleCheckout = () => {
    navigate("/checkout", { state: { packageData } });
  };

  return (
    <div
      className={`rounded-2xl overflow-hidden w-80 flex-shrink-0 flex flex-col h-full transition-all duration-300 border border-second ${style.bg} cursor-pointer relative shadow-lg group font-sans`}
    
    >
      {/* Decorative accent */}
      <div className="absolute top-0 right-0 w-20 h-20 rounded-bl-2xl opacity-20 pointer-events-none bg-fourth"></div>
      <div className="absolute bottom-0 left-0 w-20 h-20 rounded-tr-2xl opacity-10 pointer-events-none bg-sixth"></div>

      {/* Purchased badge */}
      {isPurchased && (
        <div className="absolute top-4 left-4 z-20">
          <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
            ✓ Purchased
          </span>
        </div>
      )}

      {/* Package header with image */}
      <div className="relative z-10">
        <img
          src={image}
          alt={name}
          className="w-full h-36 object-cover object-center rounded-t-2xl shadow-sm border-b border-fifth"
        />
        <div className="p-5 pb-2">
          <div className="flex justify-between items-center mb-3">
            <span
              className={`text-xs font-bold tracking-widest ${style.text} bg-white bg-opacity-80 px-3 py-1 rounded-full shadow-sm border border-second`}
            >
              {duration}
            </span>
            <span className="text-xs font-semibold text-success-700 bg-success-100 px-3 py-1 rounded-full border border-success-200">
              {numberOfClasses} Classes
            </span>
          </div>
          <h3 className="font-extrabold text-2xl mb-1 capitalize text-custom-dark tracking-tight drop-shadow-sm">
            {name}
          </h3>
          <div className="mb-2 flex items-end gap-2">
            <span className="text-3xl font-black text-third">
              AED {price}
            </span>
            <span className="text-xs text-custom-gray font-medium mb-1">
              / package
            </span>
          </div>
        </div>
      </div>

      {/* Features list */}
      <div className="px-5 pb-2 flex-1 relative z-10">
        <ul className="space-y-2">
          {features.slice(0, visibleCount).map((feature, index) => (
            <li key={index} className="flex items-start">
              <svg
                className="w-4 h-4 mt-0.5 text-sixth flex-shrink-0 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              <span className="text-sm text-custom-dark font-medium">
                {feature}
              </span>
            </li>
          ))}
        </ul>
        {totalFeatures > 3 && (
          <div className="mt-2 flex justify-start">
            {canShowMore && (
              <button
                className="text-xs text-fourth font-semibold hover:underline focus:outline-none px-2 py-1 rounded transition"
                onClick={handleShowMore}
              >
                Show {Math.min(3, totalFeatures - visibleCount)} more+
              </button>
            )}
            {!canShowMore && canShowLess && (
              <button
                className="text-xs text-fourth font-semibold hover:underline focus:outline-none px-2 py-1 rounded transition"
                onClick={handleShowLess}
              >
                Show less
              </button>
            )}
          </div>
        )}
      </div>

      {/* CTA button */}
      <div className="px-5 pb-5 relative z-10 mt-auto">
        {isPurchased ? (
          <button
            className="w-full py-3 px-4 rounded-xl text-white font-bold text-lg transition-all duration-200 bg-gray-400 cursor-not-allowed shadow-md"
            disabled
          >
            Already Purchased
          </button>
        ) : (
          <button
            className={`w-full py-3 px-4 rounded-xl text-white font-bold text-lg transition-all duration-200 ${style.button} bg-${brandColor} shadow-md group-hover:scale-105 group-hover:shadow-xl`}
            onClick={handleCheckout}
          >
            Buy Now
          </button>
        )}
      </div>
    </div>
  );
};

export default PackageCard;
