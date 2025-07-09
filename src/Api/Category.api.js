import Api from "../Middleware/axios";

export const CategoryApi = {
  Allcategory: () => Api.get("/master/get-all-categories"),
  Allsession: () => Api.get("master/get-all-sessions"),
  getAllSessionByCategoryId: (categoryId) =>
    Api.get(`master/get-session-by-category-id/${categoryId}`),
  getAllSubscription: () =>
    Api.post("subscription/get-all-subscription?isExpired=false"),
  getAllCategoriesById: (categoryId) =>
    Api.post(`subscription/get-all-subscription/${categoryId}`),
  getAllDetails: (id) => Api.get(`subscription/get-subscription-by-id/${id}`),
  getSubscriptionBySessionId: (id) =>
    Api.get(`subscription/get-subscriptions-by-session/${id}`),
  getAllTrainers: () => Api.get("trainer/get-all-trainers"),
};
