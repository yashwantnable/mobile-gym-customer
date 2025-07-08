import Api from "../Middleware/axios";

export const ReviewgApi = {
  createSubscriptionReview: (payload) =>
    Api.post("user/create-subscription-rating-review", payload),
  getSingleSubscriptionReview: (id) => Api.get(`user/get-rating-review/${id}`),

  updateReview: (id, payload) =>
    Api.put(`user/update-subscription-review/${id}`, payload),
  createTrainerReview: (payload) =>
    Api.post("user/create-trainer-rating-review", payload),
  getAllRatingReviews: () => Api.get("user/get-all-subscription-rating-review")
};
