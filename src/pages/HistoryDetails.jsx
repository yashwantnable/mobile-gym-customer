import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { BookingApi } from "../Api/Booking.api";
import { useLoading } from "../loader/LoaderContext";
import ReviewOptionsModal from "../components/ReviewOptionsModal";
import ReviewModal from "../components/ReviewModal";

const HistoryDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const [booking, setBooking] = useState(null);
  const cardData = location.state?.details;
  const { loading, handleLoading } = useLoading();

  // Review modal states
  const [showReviewOptions, setShowReviewOptions] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedReviewType, setSelectedReviewType] = useState(null);

  useEffect(() => {
    const fetchBooking = async () => {
      handleLoading(true);
      try {
        const res = await BookingApi.getBookingByid(id);
        setBooking(res?.data?.data || cardData || null);
        console.log("Booking data:", res?.data?.data);
      } catch (error) {
        // fallback to cardData if API fails
        if (cardData) setBooking(cardData);
        console.error("Error fetching booking details", error);
      } finally {
        handleLoading(false);
      }
    };
    if (id) fetchBooking();
  }, [id, cardData]);

  // Review handlers
  const handleReviewClick = () => {
    setShowReviewOptions(true);
  };

  const handleReviewOptionSelect = (type) => {
    setSelectedReviewType(type);
    setShowReviewOptions(false);
    setShowReviewModal(true);
  };

  const handleReviewModalClose = () => {
    setShowReviewModal(false);
    setSelectedReviewType(null);
  };

  const handleReviewSuccess = () => {
    // Refresh reviews or show success message
    console.log("Review submitted successfully!");
  };

  // Helper function to format date
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (!booking)
    return <div className="text-center py-12">No details found.</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white py-8 px-4">
      <div className="w-full max-w-4xl">
        <p className="text-sm text-indigo-500 font-medium mb-2">
          Booking Details
        </p>

        {/* Title and Review Button */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Your session has been Booked!
          </h1>
          <button
            onClick={handleReviewClick}
            className="bg-primary hover:bg-custom-brown text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
            Write Review
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Image */}
          <div className="flex-1 w-full md:w-1/2">
            <img
              src={
                booking.media ||
                booking.image ||
                "https://via.placeholder.com/400x300?text=No+Image"
              }
              alt="Booking"
              className="rounded-xl w-full h-64 object-cover shadow-md"
            />
          </div>
          {/* Details */}
          <div className="flex-1 w-full md:w-1/2 flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              {booking.name || booking.title || "Session"}
            </h2>
            {/* Category and Session Name */}
            <div className="flex gap-4 mb-2">
              <div className="bg-gray-100 rounded-lg px-4 py-2 flex-1">
                <div className="text-xs text-gray-500">Category</div>
                <div className="font-medium text-gray-800">
                  {booking?.categoryId?.cName || "-"}
                </div>
              </div>
              <div className="bg-gray-100 rounded-lg px-4 py-2 flex-1">
                <div className="text-xs text-gray-500">Session Name</div>
                <div className="font-medium text-gray-800">
                  {booking?.sessionType?.sessionName || "-"}
                </div>
              </div>
            </div>
            {/* Date and Trainer */}
            <div className="flex gap-4 mb-2">
              <div className="bg-gray-100 rounded-lg px-4 py-2 flex-1">
                <div className="text-xs text-gray-500">Address</div>
                <div className="font-medium text-gray-800">
                  {booking?.Address ? (
                    <>
                      {booking.Address.country?.name && (
                        <span>{booking.Address.country.name}, </span>
                      )}
                      {booking.Address.city?.name && (
                        <span>{booking.Address.city.name}, </span>
                      )}
                      {booking.Address.streetName && (
                        <span>{booking.Address.streetName}, </span>
                      )}
                      {booking.Address.landmark && (
                        <span>{booking.Address.landmark}</span>
                      )}
                    </>
                  ) : (
                    booking.address || "-"
                  )}
                </div>
              </div>
              <div className="bg-gray-100 rounded-lg px-4 py-2 flex-1">
                <div className="text-xs text-gray-500">Trainer</div>
                <div className="font-medium text-gray-800">
                  {booking.trainer
                    ? `${booking.trainer.first_name || ""} ${
                        booking.trainer.last_name || ""
                      }`.trim() || "-"
                    : booking.trainerName || "-"}
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 mt-2 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                {/* Left label: Date and Time in 2 lines */}
                <div className="flex flex-col text-sm text-gray-500">
                  <span>Date</span>
                  <span className="mt-1">Time</span> {/* Gap added here */}
                </div>

                {/* Right value */}
                {booking.date && booking.startTime ? (
                  <div className="flex flex-col items-end">
                    <span>
                      {new Date(booking.date[0]).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <span className="mt-1 text-sm text-gray-500">
                      {booking.startTime} - {booking.endTime}
                    </span>
                  </div>
                ) : (
                  <span>-</span>
                )}
              </div>

              <div className="flex justify-between items-center mb-1 mt-2">
                <span className="text-sm text-gray-500">Price</span>

                {booking.price ? `AED ${booking.price}` : "N/A"}
              </div>
              <div className="flex justify-between items-center">
                {/* <span className="text-sm text-gray-500">Description</span> */}
                <span className="text-sm text-gray-700">
                  {/* {booking?.description || "-"} */}
                </span>
              </div>
            </div>
            <button
              className="mt-6 bg-primary hover:bg-custom-dark text-white font-semibold py-2 px-6 rounded-lg transition-colors w-fit self-end"
              onClick={() => (window.location.href = "/history")}
            >
              Back to History
            </button>
          </div>
        </div>
      </div>

      {/* Review Modals */}
      <ReviewOptionsModal
        isOpen={showReviewOptions}
        onClose={() => setShowReviewOptions(false)}
        onSelectOption={handleReviewOptionSelect}
      />

      <ReviewModal
        isOpen={showReviewModal}
        onClose={handleReviewModalClose}
        type={selectedReviewType}
        bookingData={booking}
        onSuccess={handleReviewSuccess}
      />
    </div>
  );
};

export default HistoryDetails;
