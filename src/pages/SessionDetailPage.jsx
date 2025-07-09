import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import yogaImage from "../Assests/yoga.jpg";
import { CategoryApi } from "../Api/Category.api";
import { useLoading } from "../loader/LoaderContext";
import { IoIosArrowForward } from "react-icons/io";

export default function SessionDetailPage() {
  const navigate = useNavigate();
  const [visibleReviews, setVisibleReviews] = useState(3);
  const { handleLoading } = useLoading();

  const [classData, setclassData] = useState({});
  const reviewsPerPage = 3;
  const { id } = useParams();

  const fetchSessionDetails = async () => {
    handleLoading(true);
    try {
      const res = await CategoryApi.getAllDetails(id);
      setclassData(res?.data?.data || {});
    } catch (error) {
      console.log("Error", error);
    } finally {
      handleLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchSessionDetails();
    }
  }, [id]);

  const handleLoadMore = () => {
    setVisibleReviews((prev) => prev + reviewsPerPage);
  };

  const hasMoreReviews = visibleReviews < dummyReviews.length;

  const handlePurchase = () => {
    navigate("/checkout", { state: { classData } });
  };

  function formatTimeTo12Hour(time24) {
    if (!time24) return "";
    const [hourStr, minute] = time24.split(":");
    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12;
    if (hour === 0) hour = 12;
    return `${hour}:${minute} ${ampm}`;
  }

  return (
    <div className="max-w-6xl mx-auto p-2 sm:p-4">
      {/* Top section: Image + Details */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 md:mb-8 mt-6 md:mt-10">
        {/* Image */}
        <div className="md:w-1/2 w-full">
          <div className="h-48 xs:h-56 sm:h-64 md:h-[300px] rounded-lg overflow-hidden">
            <img
              src={classData?.media || yogaImage}
              alt="Class"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Details Section */}
        <div className="md:w-1/3 w-full mt-6 md:mt-0">
          <h2 className="text-xl sm:text-2xl font-semibold mb-2">
            {classData?.name?.toUpperCase()}
          </h2>

          {/* Session Type Name */}
          {classData?.sessionType?.sessionName && (
            <div className="text-sm text-gray-500 mb-2">
              {/* Session Type:{" "} */}
              <span className="font-semibold text-custom-dark">
                {classData.sessionType.sessionName}
              </span>
            </div>
          )}

          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <img
              src={
                classData?.trainer?.profile_image ||
                "https://randomuser.me/api/portraits/women/44.jpg"
              }
              alt="Instructor"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full"
            />

            <span className="text-gray-700 text-xs sm:text-sm">
              {classData?.trainer?.first_name?.toUpperCase()}{" "}
              {classData?.trainer?.last_name?.toUpperCase()}
            </span>
          </div>
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-start gap-2 sm:gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 sm:h-5 sm:w-5 mt-1 flex-shrink-0 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <p className="text-gray-700 text-xs sm:text-sm">
                {classData?.streetName}
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-gray-700 text-xs sm:text-sm">
                {/* Start Date - End Date */}
                {classData?.date?.length > 0 && (
                  <>
                    <span>
                      {new Date(classData.date[0]).toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    {classData?.date?.length > 1 && (
                      <>
                        {" "}
                        -{" "}
                        <span>
                          {new Date(classData.date[1]).toLocaleDateString(
                            "en-US",
                            {
                              weekday: "long",
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </span>
                      </>
                    )}
                  </>
                )}
                {/* Start Time - End Time */}
                {classData?.startTime && (
                  <>
                    {", "}
                    <span>{formatTimeTo12Hour(classData.startTime)}</span>
                  </>
                )}
                {classData?.endTime && (
                  <>
                    {" - "}
                    <span>{formatTimeTo12Hour(classData.endTime)}</span>
                  </>
                )}
              </p>
            </div>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 mt-4 border min-w-0 max-w-full">
            {/* Price */}
            <div className="flex flex-col items-center flex-shrink-0">
              <span className="text-2xl sm:text-4xl font-extrabold text-custom-dark tracking-tight">
                {classData?.price}
                <span className="text-xs sm:text-base font-medium text-gray-500 ml-1">
                  AED
                </span>
              </span>
              <span className="text-xs text-gray-400 mt-1">per session</span>
            </div>
            {/* Purchase Button */}
            <button
              onClick={handlePurchase}
              className="flex items-center gap-2 bg-custom-dark hover:bg-black transition-colors text-white px-6 py-3 sm:px-10 sm:py-4 rounded-lg font-semibold text-base sm:text-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-custom-dark w-full sm:w-auto justify-center overflow-hidden"
              style={{ letterSpacing: "0.1em" }}
            >
              SUBSCRIBE
              {/* <IoIosArrowForward className="text-white h-6 w-6" /> */}
              <IoIosArrowForward className="text-white w-6 h-6 flex-shrink-0" />
            </button>
          </div>
        </div>
      </div>

      {/* About the class */}
      <div className="mt-8 md:mt-10 border-t pt-4 md:pt-6">
        <h3 className="text-xl sm:text-3xl font-md mb-3 sm:mb-4">
          About the class
        </h3>
        <div>
          <div className="text-xs font-semibold tracking-widest text-gray-700 mb-2">
            DESCRIPTION
          </div>
          <DescriptionWithShowMore text={classData?.description || ""} />
        </div>
      </div>
      <hr className="mt-8 md:mt-10"></hr>

      {/* Location Section */}
      <div className="mt-10 md:mt-12">
        <h3 className="text-xl sm:text-3xl font-semibold mb-3 sm:mb-4">
          Location
        </h3>
        <div className="flex flex-col gap-1 sm:gap-2 mb-3 sm:mb-4 mt-6 sm:mt-10">
          <div className="flex items-center gap-1 sm:gap-2 text-gray-700 text-sm sm:text-base">
            {/* Phone icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 sm:h-5 sm:w-5 inline-block"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h2.28a2 2 0 011.94 1.52l.3 1.2a2 2 0 01-.45 1.95l-1.1 1.1a16.06 16.06 0 006.36 6.36l1.1-1.1a2 2 0 011.95-.45l1.2.3A2 2 0 0121 16.72V19a2 2 0 01-2 2h-1C9.163 21 3 14.837 3 7V5z"
              />
            </svg>
            {classData?.trainer?.phone_number || "(503) 729-0349"}
          </div>
          <div className="text-gray-800 text-sm sm:text-base">
            {classData?.streetName ||
              "10121 Southwest Nimbus Avenue Suite C2, Tigard, OR 97223"}
          </div>
          <div className="text-gray-600 text-sm sm:text-base">
            {classData?.city?.name || "Metzger"}
          </div>
        </div>
        <div className="w-full h-40 xs:h-52 sm:h-64 md:h-72 rounded-lg overflow-hidden border mt-6 sm:mt-10">
          <iframe
            title="Google Map"
            src="https://www.google.com/maps?q=10121+Southwest+Nimbus+Avenue+Suite+C2,+Tigard,+OR+97223&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
      <hr className="mt-6 md:mt-8"></hr>

      {/* Reviews Section */}
      <div className="mt-10 md:mt-16">
        <div className="flex flex-col gap-6 md:gap-12">
          {dummyReviews.slice(0, visibleReviews).map((review, idx) => (
            <div
              key={idx}
              className="flex flex-col gap-1 sm:gap-2 border-b pb-6 md:pb-8"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <span className="font-semibold text-base sm:text-lg text-gray-800">
                  {review.name}
                </span>
                <span className="flex items-center ml-0 sm:ml-2">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={
                        i < review.rating
                          ? "text-yellow-400 text-sm sm:text-base"
                          : "text-gray-300 text-sm sm:text-base"
                      }
                    >
                      ★
                    </span>
                  ))}
                </span>
              </div>
              <div className="text-gray-500 text-xs sm:text-sm mb-0 sm:mb-1">
                {review.date}
              </div>
              <div className="text-gray-700 text-sm sm:text-base mb-0 sm:mb-1">
                {review.classTitle} with {review.instructor}
              </div>
              {review.text && (
                <div className="text-gray-700 text-sm sm:text-base mt-1">
                  {review.text}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="mt-6 md:mt-8">
          {hasMoreReviews ? (
            <button
              onClick={handleLoadMore}
              className="text-custom-dark px-4 py-2 sm:px-6 sm:py-2 rounded-lg  "
            >
              Load More
            </button>
          ) : (
            <p className="text-gray-500 text-xs sm:text-sm">No more reviews</p>
          )}
        </div>
      </div>
    </div>
  );
}

function DescriptionWithShowMore({ text, maxChars = 250 }) {
  const [showMore, setShowMore] = React.useState(false);
  if (!text || text.length <= maxChars) {
    return <p className="text-gray-700 text-base max-w-2xl">{text}</p>;
  }
  return (
    <div>
      <p className="text-gray-700 text-base max-w-2xl">
        {showMore ? text : `${text.slice(0, maxChars)}...`}
      </p>
      <button
        className="text-gray-500 underline text-sm hover:text-black focus:outline-none mt-1"
        onClick={() => setShowMore(!showMore)}
      >
        {showMore ? "Show less" : "Show more"}
      </button>
    </div>
  );
}

function Highlights({ iconType, label }) {
  let icon = null;
  const iconClass = "h-8 w-8 text-teal-500";
  if (iconType === "store") {
    icon = (
      <svg
        className={iconClass}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 7V6a2 2 0 012-2h14a2 2 0 012 2v1M3 7l1.34 8.03A2 2 0 006.32 17h11.36a2 2 0 001.98-1.97L21 7M3 7h18"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16 11V17M8 11V17M12 11V17"
        />
      </svg>
    );
  } else if (iconType === "badge") {
    icon = (
      <svg
        className={iconClass}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17 17.657V21l-5-2-5 2v-3.343A8 8 0 1117 17.657z"
        />
        <circle cx="12" cy="11" r="3" stroke="currentColor" strokeWidth="2" />
      </svg>
    );
  } else if (iconType === "female") {
    icon = (
      <svg
        className={iconClass}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="12" cy="8" r="5" stroke="currentColor" strokeWidth="2" />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 13v7M9 20h6"
        />
      </svg>
    );
  }
  return (
    <div className="flex flex-col items-center min-w-[120px]">
      {icon}
      <span className="text-gray-500 text-base font-normal mt-2 tracking-wide">
        {label}
      </span>
    </div>
  );
}

// Dummy reviews data
const dummyReviews = [
  {
    name: "Cathy R",
    date: "September 5, 2024",
    rating: 5,
    classTitle: "Strength / Cardio Split",
    instructor: "Jessica Lamberger",
    text: "Coach Jess is fabulous!",
  },
  {
    name: "kirksey n",
    date: "July 3, 2024",
    rating: 5,
    classTitle: "Strength / Cardio Split",
    instructor: "Shawn Thurston",
    text: "",
  },
  {
    name: "Lorenzo C",
    date: "February 17, 2024",
    rating: 3,
    classTitle: "Strength / Cardio Split",
    instructor: "Jeff Walsh",
    text: "",
  },
  {
    name: "Sarah M",
    date: "January 15, 2024",
    rating: 5,
    classTitle: "Strength / Cardio Split",
    instructor: "Jessica Lamberger",
    text: "Amazing workout! Really pushed my limits and felt great afterwards.",
  },
  {
    name: "Mike T",
    date: "December 28, 2023",
    rating: 4,
    classTitle: "Strength / Cardio Split",
    instructor: "Shawn Thurston",
    text: "Great class, instructor was very motivating and helpful.",
  },
  {
    name: "Jennifer L",
    date: "December 10, 2023",
    rating: 5,
    classTitle: "Strength / Cardio Split",
    instructor: "Jeff Walsh",
    text: "Perfect balance of strength and cardio. Will definitely come back!",
  },
  {
    name: "David K",
    date: "November 22, 2023",
    rating: 4,
    classTitle: "Strength / Cardio Split",
    instructor: "Jessica Lamberger",
    text: "Challenging but rewarding workout. Instructor knows how to motivate.",
  },
  {
    name: "Lisa P",
    date: "November 8, 2023",
    rating: 5,
    classTitle: "Strength / Cardio Split",
    instructor: "Shawn Thurston",
    text: "Best fitness class I've ever taken! Highly recommend.",
  },
  {
    name: "Robert W",
    date: "October 30, 2023",
    rating: 3,
    classTitle: "Strength / Cardio Split",
    instructor: "Jeff Walsh",
    text: "Good workout, but a bit too intense for beginners.",
  },
];
