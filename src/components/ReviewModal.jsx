import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { FiX, FiStar } from "react-icons/fi";
import {
  subscriptionReviewSchema,
  trainerReviewSchema,
} from "../utils/ValidationSchema";
import { ReviewgApi } from "../Api/Review.api";
import { useLoading } from "../loader/LoaderContext";

const ReviewModal = ({ isOpen, onClose, type, bookingData, onSuccess }) => {
  const [hoveredRating, setHoveredRating] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const { handleLoading } = useLoading();
  const [existingReview, setExistingReview] = useState(null);
  const [updateReview, setUpdateReview] = useState("");
  const [trainer, setTrainer] = useState([]);

  // Update existing review by review ID (not subscription ID)
  const updateSubscriptionReview = async (id, payload) => {
    handleLoading(true);
    try {
      const res = await ReviewgApi.updateReview(id, payload);
      console.log("Review updated successfully:", res);
      return res?.data?.data;
    } catch (error) {
      console.log("Error updating review:", error);
      throw error;
    } finally {
      handleLoading(false);
    }
  };

  const updatesingleTrainer = async (id, payload) => {
    handleLoading(true);
    try {
      const res = await ReviewgApi.updateTrainerReview(id, payload);
      console.log("Review updated successfully:", res);
      return res?.data?.data;
    } catch (error) {
      console.log("Error updating review:", error);
      throw error;
    } finally {
      handleLoading(false);
    }
  };

  const getTrainerReview = async (id) => {
    handleLoading(true);
    try {
      const res = await ReviewgApi.getSingleTrainerReview(id);
      setTrainer(res?.data?.data);
      // Set the first review as existingReview (or filter by user if needed)
      if (res?.data?.data?.length > 0) {
        setExistingReview(res.data.data[0]);
      } else {
        setExistingReview(null);
      }
    } catch (error) {
      console.log("Error", error);
    } finally {
      handleLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && type === "trainer") {
      // Try to get trainerId from bookingData
      const trainerId = bookingData?.trainer?._id || bookingData?.trainerId;
      if (trainerId) {
        getTrainerReview(trainerId);
      }
    }
  }, [isOpen, type, bookingData]);

  useEffect(() => {
    // Only fetch review if modal is open and it's a subscription review
    if (
      isOpen &&
      type === "subscription" &&
      (bookingData?.subscriptionId || bookingData?._id)
    ) {
      const fetchReview = async () => {
        console.log("bookingData:", bookingData);
        handleLoading(true);
        try {
          // Robustly extract subscriptionId from bookingData
          const subscriptionId =
            bookingData?.subscriptionId?._id ||
            bookingData?.subscriptionId ||
            bookingData?._id;
          console.log("Fetching review for subscription ID:", subscriptionId);

          if (!subscriptionId) {
            console.warn(
              "No subscription ID found in booking data:",
              bookingData
            );
            return;
          }
          console.log("subscriptionId:", subscriptionId);

          const res = await ReviewgApi.getSingleSubscriptionReview(
            subscriptionId
          );
          console.log("Review API response:", res);
          setExistingReview(res?.data?.data); // Save the review data if needed
          console.log("Existing review set:", res?.data?.data);
        } catch (error) {
          console.log("Error fetching review:", error);
          // Don't throw error here as it might be normal if no review exists yet
          if (error.response?.status === 404) {
            console.log("No review found for this subscription (404)");
          } else if (error.response?.status === 401) {
            console.error("Unauthorized - check authentication");
          } else if (error.response?.status === 500) {
            console.error("Server error - check backend");
          }
        } finally {
          handleLoading(false);
        }
      };
      fetchReview();
    }
  }, [isOpen, type, bookingData?.subscriptionId || bookingData?._id]);

  if (!isOpen) return null;

  const isSubscription = type === "subscription";
  const validationSchema = isSubscription
    ? subscriptionReviewSchema
    : trainerReviewSchema;
  const title = isSubscription ? "Rate Your Session" : "Rate Your Trainer";
  const description = isSubscription
    ? "Share your experience with this session"
    : "Share your experience with this trainer";

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    handleLoading(true);
    setErrorMessage(""); // Clear any previous errors
    try {
      // Debug logging to see the booking data structure
      console.log("Booking data received:", bookingData);
      console.log("Trainer data:", bookingData?.trainer);
      console.log("Trainer ID options:", {
        trainerId: bookingData?.trainer?._id,
        trainerIdAlt: bookingData?.trainerId,
        trainerIdDirect: bookingData?.trainerId,
      });

      const payload = {
        subscriptionId: bookingData?.subscriptionId || bookingData?._id,
        rating: values.rating,
        review: values.review,
      };

      // Try different possible trainer ID locations
      console.log("Booking data", bookingData);
      const trainerId = bookingData?.trainer?._id || bookingData?.trainerId;

      const payloadTrainer = {
        trainer: trainerId,
        rating: values.rating,
        review: values.review,
      };

      console.log("Final payload data", payload);
      console.log("Final trainer payload", payloadTrainer);

      if (isSubscription && !payload.subscriptionId) {
        throw new Error("Subscription ID is required");
      }

      if (!isSubscription && !trainerId) {
        console.error("Trainer ID not found in booking data:", {
          trainer: bookingData?.trainer,
          trainerId: bookingData?.trainerId,
          trainer_id: bookingData?.trainer_id,
          fullBookingData: bookingData,
        });
        throw new Error("Trainer ID is required but not found in booking data");
      }

      if (values.rating <= 0) {
        throw new Error("Rating must be greater than 0");
      }

      let response;
      if (isSubscription) {
        if (existingReview) {
          console.log("exting data", existingReview);
          // Update existing review (remove subscriptionId from payload)
          const { rating, review } = payload;
          response = await updateSubscriptionReview(
            existingReview.subscriptionId._id,
            {
              rating,
              review,
            }
          );
        } else {
          // Create new review (keep subscriptionId in payload)
          response = await ReviewgApi.createSubscriptionReview(payload);
        }
      } else {
        if (existingReview) {
          console.log(" Trainer exting data", existingReview);
          // Update existing trainer review
          const { rating, review } = payloadTrainer;
          response = await updatesingleTrainer(trainerId, {
            rating,
            review,
          });
        } else {
          // Create new trainer review
          response = await ReviewgApi.createTrainerReview(payloadTrainer);
        }
      }

      console.log("Review submitted successfully:", response);
      onSuccess && onSuccess();
      resetForm();
      onClose();
    } catch (error) {
      console.error("Error submitting review:", error);
      setErrorMessage(
        error.message || "Failed to submit review. Please try again."
      );
    } finally {
      handleLoading(false);
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setErrorMessage(""); // Clear error message when closing
    onClose();
  };

  const renderStars = (field, form) => {
    const rating = field.value || 0;
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      stars.push(
        <button
          key={i}
          type="button"
          className={`text-2xl transition-colors ${
            i <= (hoveredRating || rating) ? "text-yellow-400" : "text-gray-300"
          } hover:text-yellow-400`}
          onMouseEnter={() => setHoveredRating(i)}
          onMouseLeave={() => setHoveredRating(0)}
          onClick={() => form.setFieldValue(field.name, i)}
        >
          <FiStar className="w-8 h-8 fill-current" />
        </button>
      );
    }

    return (
      <div className="flex items-center gap-1">
        {stars}
        <span className="ml-2 text-sm text-gray-600">
          {hoveredRating || rating}/5
        </span>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 transform transition-all">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <Formik
          initialValues={{
            // subscriptionId: "",
            rating: existingReview?.rating || 0,
            review: existingReview?.review || "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize={true}
        >
          {({ values, isSubmitting, setFieldValue }) => (
            <Form className="p-6">
              {/* Rating */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Rating *
                </label>
                <Field name="rating">
                  {({ field, form }) => renderStars(field, form)}
                </Field>
                <ErrorMessage
                  name="rating"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Review Text */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Review *
                </label>
                <Field
                  as="textarea"
                  name="review"
                  placeholder="Share your experience..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows="4"
                />
                <ErrorMessage
                  name="review"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
                <div className="text-xs text-gray-500 mt-1">
                  {values.review.length}/500 characters
                </div>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{errorMessage}</p>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || values.rating === 0}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting
                    ? "Submitting..."
                    : existingReview
                    ? "Update Review"
                    : "Submit Review"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ReviewModal;
