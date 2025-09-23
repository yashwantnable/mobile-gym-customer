import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import yogaImage from "../Assests/yoga.jpg";
import { CategoryApi } from "../Api/Category.api";
import { useLoading } from "../loader/LoaderContext";
import { IoIosArrowForward } from "react-icons/io";
import moment from "moment";
import Description from "../components/Description";
import { ReviewgApi } from "../Api/Review.api";
import { useTheme } from "../contexts/ThemeContext";

export default function SessionDetailPage() {
  const navigate = useNavigate();
  const [visibleReviews, setVisibleReviews] = useState(3);
  const { lightMode } = useTheme();
  const { handleLoading } = useLoading();

  const [classData, setclassData] = useState({});
  const [reviewsdata, setReviewsdata] = useState([]); // Initialize as empty array

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

  const sessionAllRating = async () => {
    handleLoading(true);
    try {
      console.log("Calling reviews API for id:", id); // Add this
      const res = await ReviewgApi.getAllRatingReviews(id);
      console.log("Review Response:", res.data); // Log response
      setReviewsdata(
        Array.isArray(res?.data?.data?.reviews) ? res.data.data.reviews : []
      );
    } catch (error) {
      console.log("Error", error);
      setReviewsdata([]);
    } finally {
      handleLoading(false);
    }
  };

  useEffect(() => {
    console.log("id from params:", id);
    if (id) {
      sessionAllRating();
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchSessionDetails();
    }
  }, [id]);

  const handleLoadMore = () => {
    setVisibleReviews((prev) => prev + reviewsPerPage);
  };

  const hasMoreReviews = reviewsdata && visibleReviews < reviewsdata.length;

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

  // Helper to build address string for Google Maps
  function getAddressString() {
    const address = classData?.Address;
    if (address) {
      const parts = [
        address.streetName,
        address.landmark,
        address.city?.name,
        address.country?.name,
      ].filter(Boolean);
      return parts.join(", ");
    }
    // fallback
    return "10121 Southwest Nimbus Avenue Suite C2, Tigard, OR 97223";
  }

  return (
    <div className="max-w-6xl mx-auto p-2 sm:p-4">
      {/* Top section */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 md:mb-8 mt-6 md:mt-10">
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
          <h2 className={`text-xl sm:text-2xl font-semibold mb-2 ${lightMode?"":"text-gray-200"}`}>
            {classData?.name?.toUpperCase()}
          </h2>

          {/* Session Type Name */}
          {classData?.sessionType?.sessionName && (
            <div className={`text-sm ${lightMode?"text-gray-400":"text-gray-100"} mb-2`}>
              <span className="font-semibold ">
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

            <span className={`${lightMode?"text-gray-700":"text-gray-100"} text-xs sm:text-sm`}>
              {(classData?.trainer?.first_name || "").toUpperCase()}{" "}
              {(classData?.trainer?.last_name || "").toUpperCase()}
            </span>
          </div>
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 sm:h-6 sm:w-6 mt-1 flex-shrink-0 text-blue-500"
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
              <p className={`${lightMode?"text-gray-700":"text-gray-200"} text-xs sm:text-sm`}>
                {classData?.Address?.streetName || ""}
                {classData?.Address?.landmark
                  ? `, ${classData.Address.landmark}`
                  : ""}
                {classData?.Address?.city?.name
                  ? `, ${classData.Address.city.name}`
                  : ""}
                {classData?.Address?.country?.name
                  ? `, ${classData.Address.country.name}`
                  : ""}
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <p className="text-gray-700">
                {/* Date Range */}
                {classData?.date?.length > 0 && (
                  <span className="inline-flex items-center text-sm font-medium bg-gray-100 rounded-full px-3 py-1 mb-1">
                    <svg
                      className="w-3 h-3 mr-1 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="font-semibold text-gray-700">
                      {moment(classData.date[0]).format("DD MMM YYYY")}
                    </span>
                    {classData?.date?.length > 1 && (
                      <>
                        <span className="mx-1 text-gray-500">to</span>
                        <span className="font-semibold text-gray-700">
                          {moment(classData.date[1]).format("DD MMM YYYY")}
                        </span>
                      </>
                    )}
                  </span>
                )}

                {/* Time Range */}
                {(classData?.startTime || classData?.endTime) && (
                  <span className="inline-flex items-center text-sm font-medium bg-blue-50 rounded-full px-3 py-1 ml-1">
                    <svg
                      className="w-3 h-3 mr-1 text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {classData?.startTime && (
                      <span className="font-semibold text-blue-600">
                        {formatTimeTo12Hour(classData.startTime)}
                      </span>
                    )}
                    {classData?.endTime && (
                      <>
                        <span className="mx-1 text-blue-400">to</span>
                        <span className="font-semibold text-blue-600">
                          {formatTimeTo12Hour(classData.endTime)}
                        </span>
                      </>
                    )}
                  </span>
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
              <IoIosArrowForward className="text-white w-6 h-6 flex-shrink-0" />
            </button>
          </div>
        </div>
      </div>

      {/* About the class */}
      <div className="mt-8 md:mt-10 border-t pt-4 md:pt-6">
        <h3 className={`text-xl sm:text-3xl font-md mb-3 sm:mb-4 ${lightMode?"":"text-gray-300"}`}>
          About the class
        </h3>
        <div className={`${lightMode?"text-gray-700":"text-gray-300"}`}>
          <div className={`text-xs font-semibold tracking-widest   mb-2`}>
            DESCRIPTION
          </div>
          <Description
            description={classData?.description || ""}
            length={500}
            lightMode={lightMode}
          />
        </div>
      </div>
      <hr className="mt-8 md:mt-10"></hr>

      {/* Location Section */}
      <div className="mt-10 md:mt-12">
        <h3 className={`text-xl sm:text-3xl font-semibold mb-3 sm:mb-4 ${lightMode?"text-gray-700":"text-gray-200"}`}>
          Location
        </h3>
        <div className="flex flex-col gap-1 sm:gap-2 mb-3 sm:mb-4 mt-6 sm:mt-10">
          <div className={`flex items-center gap-1 sm:gap-2 ${lightMode?"text-gray-700":"text-gray-200"} text-sm sm:text-base`}>
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
          <div className={`${lightMode?"text-gray-800":"text-gray-200"} text-sm sm:text-base`}>
            {classData?.Address?.streetName ||
              "10121 Southwest Nimbus Avenue Suite C2, Tigard, OR 97223"}
          </div>
          <div className={`${lightMode?"text-gray-600":"text-gray-200"} text-sm sm:text-base`}>
            {classData?.Address?.city?.name || "Metzger"}
          </div>
        </div>
        <div className="w-full h-40 xs:h-52 sm:h-64 md:h-72 rounded-lg overflow-hidden border mt-6 sm:mt-10">
          <iframe
            title="Google Map"
            src={`https://www.google.com/maps?q=${encodeURIComponent(
              getAddressString()
            )}&output=embed`}
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
          {Array.isArray(reviewsdata) && reviewsdata.length > 0 ? (
            reviewsdata.slice(0, visibleReviews).map((review, idx) => (
              <div
                key={idx}
                className="flex flex-col gap-1 sm:gap-2 border-b pb-6 md:pb-8"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <span className="font-semibold text-base sm:text-lg text-gray-800">
                    {review.created_by?.first_name || "Anonymous"}
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
                <div className="text-gray-700 text-sm sm:text-base mt-1">
                  {review?.review}
                </div>
              </div>
            ))
          ) : (
            <p className={`${lightMode?"text-gray-500":"text-gray-200"} text-xs sm:text-sm`}>No reviews yet.</p>
          )}
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
            <p className={`${lightMode?"text-gray-500":"text-gray-200"} text-xs sm:text-sm`}>No more reviews</p>
          )}
        </div>
      </div>
    </div>
  );
}
