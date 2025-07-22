import Api from "../Middleware/axios";

export const ReviewgApi = {
  createSubscriptionReview: (payload) =>
    Api.post("user/create-subscription-rating-review", payload),
  getSingleSubscriptionReview: (id) => Api.get(`user/get-rating-review/${id}`),

  updateReview: (id, payload) =>
    Api.put(`user/update-subscription-review/${id}`, payload),
  createTrainerReview: (payload) =>
    Api.post("user/create-trainer-rating-review", payload),
  getSingleTrainerReview: (id) => Api.get(`user/get-trainer-review/${id}`),

  updateTrainerReview: (id, payload) =>
    Api.put(`user/update-trainer-review/${id}`, payload),
  getAllRatingReviews: (id) =>
    Api.get(`user/get-all-subscription-rating-review/${id}`),
  // getAllRatingReviews: () => Api.get("user/get-all-subscription-rating-review"),
  getAllRatingReviewsSessions: () =>
    Api.get("user/get-all-subscription-rating-review"),
};
