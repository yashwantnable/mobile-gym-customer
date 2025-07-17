import Api from "../Middleware/axios";

export const BookingApi = {
  createSubscription: (payload) => Api.post("booking/subscribe", payload),
  getSubscriptionDetailsById: (id) =>
    Api.get(`booking/get-booking-by-id/${id}`),
  getBookingHistory: () => Api.get("booking/my-subscriptions"),
  getSearchHistory: (search) =>
    Api.get(`subscription/search-subscriptions?keyword=${search}`),

  getBookingByid: (id) => Api.get(`booking/get-booking-by-id/${id}`),
  getExpiredSubscription: () => Api.get("/booking/get-expired-subscriptions"),
  applyPromoCodeToSubscription: (payload) => Api.post("/booking/subscription-apply-promo",payload),
};
