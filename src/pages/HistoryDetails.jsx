import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { BookingApi } from "../Api/Booking.api";
import { useLoading } from "../loader/LoaderContext";
import ReviewOptionsModal from "../components/ReviewOptionsModal";
import ReviewModal from "../components/ReviewModal";
import {
  FaStar,
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaUserAlt,
  FaTag,
} from "react-icons/fa";

const HistoryDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const cardData = location.state?.details;
  const { loading, handleLoading } = useLoading();
  const [isLoading, setIsLoading] = useState(false);

  const [showReviewOptions, setShowReviewOptions] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedReviewType, setSelectedReviewType] = useState(null);
  const [attendanceStatus, setAttendanceStatus] = useState({});

  const handleAttend = async (subscriptionId, bookingId) => {
    setIsLoading(true);
    // const loadingToast = toast.loading("Marking attendance...");

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
        });
      });

      const { latitude, longitude } = position.coords;

      const payload = {
        bookingId,
        subscriptionId,
        coordinates: [longitude, latitude],
      };

      const response = await BookingApi.attendSubscription(payload);

      // If success is false or status not 200, show server message
      if (
        !response ||
        response.status !== 200 ||
        response.data?.success === false
      ) {
        const errorMessage =
          response?.data?.message ||
          response?.data?.error?.message ||
          "Failed to mark attendance";

        throw new Error(errorMessage);
      }

      setAttendanceStatus((prev) => ({
        ...prev,
        [subscriptionId]: "attended",
      }));

      toast.success("✅ Attendance marked successfully!", { id: loadingToast });
    } catch (error) {
      console.error("Attendance error:", error);
      toast.error(` ${error.message || "Something went wrong"}`, {
        id: loadingToast,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchBooking = async () => {
      handleLoading(true);
      try {
        const res = await BookingApi.getBookingByid(id);
        setBooking(res?.data?.data || cardData || null);
      } catch (error) {
        if (cardData) setBooking(cardData);
        console.error("Error fetching booking details", error);
      } finally {
        handleLoading(false);
      }
    };
    if (id) fetchBooking();
  }, [id, cardData]);

  console.log("booking:", booking);
  // Review handlers
  const handleReviewClick = () => {
    setShowReviewOptions(true);
  };

  const handleReviewOptionSelect = (type) => {
    setSelectedReviewType(type);
    setShowReviewOptions(false);
    setShowReviewModal(true);
  };

  const handleBackToOptions = () => {
    setShowReviewModal(false);
    setShowReviewOptions(true);
    setSelectedReviewType(null);
  };

  const handleReviewModalClose = () => {
    setShowReviewModal(false);
    setSelectedReviewType(null);
  };

  const handleReviewSuccess = () => {
    console.log("Review submitted successfully!");
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getBookingDetails = (booking) => {
    if (!booking) return {};
    const source = booking.subscription || booking;
    const date = booking.createdAt || source.date;
    const time =
      source.startTime && source.endTime
        ? `${source.startTime} - ${source.endTime}`
        : "-";
    const address = source.Address
      ? [
          source.Address.country?.name,
          source.Address.city?.name,
          source.Address.streetName,
          source.Address.landmark,
        ]
          .filter(Boolean)
          .join(", ")
      : source.address || "-";
    const trainerName = source.trainer
      ? `${source.trainer.first_name || ""} ${
          source.trainer.last_name || ""
        }`.trim()
      : source.trainerName || "-";

    return {
      media: source.media,
      category: source.categoryId?.cName || "-",
      sessionName: source.sessionType?.sessionName || "-",
      address,
      trainerName,
      date,
      time,
      price: source.price,
      name: source.name || "Session",
      description: source.description || "",
    };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 p-4">
        <div className="text-center max-w-md">
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            No Booking Details Found
          </h2>
          <p className="text-gray-600 mb-6">
            We couldn't find any details for this booking. Please try again
            later or return to your history.
          </p>
          <button
            onClick={() => navigate("/history")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Back to History
          </button>
        </div>
      </div>
    );
  }

  const details = getBookingDetails(booking);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex-grow">
            Booking Details
          </h1>
        </div>

        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="bg-primary p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-white/20 rounded-full p-2 mr-3">
                  <FaCalendarAlt className="text-third" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-third">
                    Your Session Has Been Booked!
                  </h2>
                </div>
              </div>
              <button
                onClick={handleReviewClick}
                className="bg-white text-third font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
              >
                <FaStar className="text-yellow-500" />
                Review
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <div className="relative rounded-xl overflow-hidden shadow-md">
                  <img
                    src={
                      details.media ||
                      "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1170&q=80"
                    }
                    alt="Booking"
                    className="w-full h-72 object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium text-indigo-700">
                    {details.category}
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Description
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-gray-700">
                      {details.description || "No description available."}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                    <button className="px-6 py-2 border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                      Can't Attend
                    </button>
                    <button
                      onClick={() =>
                        handleAttend(booking.subscription._id, booking._id)
                      }
                      disabled={isLoading}
                      className={`px-6 py-2 rounded-md font-medium ${
                        isLoading
                          ? "bg-indigo-400 cursor-not-allowed"
                          : "bg-indigo-600 hover:bg-indigo-700"
                      } text-white transition-colors`}
                    >
                      {isLoading ? "Processing..." : "Present"}
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    {details.name.toUpperCase()}
                  </h2>

                  <div className="space-y-5">
                    <div className="flex items-start">
                      <div className="bg-indigo-100 p-3 rounded-lg mr-4">
                        <FaTag className="text-indigo-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">
                          Session Type
                        </h4>
                        <p className="font-medium text-gray-800">
                          {details.sessionName}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="bg-indigo-100 p-3 rounded-lg mr-4">
                        <FaUserAlt className="text-indigo-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">
                          Trainer
                        </h4>
                        <p className="font-medium text-gray-800">
                          {details.trainerName}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="bg-indigo-100 p-3 rounded-lg mr-4">
                        <FaMapMarkerAlt className="text-indigo-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">
                          Location
                        </h4>
                        <p className="font-medium text-gray-800">
                          {details.address}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-3">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <FaCalendarAlt className="text-gray-500 mr-2" />
                          <h4 className="text-sm font-medium text-gray-500">
                            Date
                          </h4>
                        </div>
                        <p className="font-medium text-gray-800">
                          {details.date ? formatDate(details.date) : "-"}
                        </p>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <FaClock className="text-gray-500 mr-2" />
                          <h4 className="text-sm font-medium text-gray-500">
                            Time
                          </h4>
                        </div>
                        <p className="font-medium text-gray-800">
                          {details.time || "-"}
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Total Price:</span>
                        <span className="text-xl font-bold text-indigo-600">
                          {details.price ? `AED ${details.price}` : "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={() => navigate("/history")}
                      className="bg-primary text-third font-medium py-2 px-6 rounded-lg transition-colors"
                    >
                      Back to History
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ReviewOptionsModal
        isOpen={showReviewOptions}
        onClose={() => setShowReviewOptions(false)}
        onSelectOption={handleReviewOptionSelect}
      />

      <ReviewModal
        isOpen={showReviewModal}
        onClose={handleReviewModalClose}
        onBackToOptions={handleBackToOptions}
        type={selectedReviewType}
        bookingData={booking}
        onSuccess={handleReviewSuccess}
      />
    </div>
  );
};

export default HistoryDetails;
