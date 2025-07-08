import Api from "../Middleware/axios";

export const FilterApi = {
    filterByDate: (payload) => Api.post(`subscription/get-subscriptions-by-date`,payload),
    filterByTrainerId: (trainerId) => Api.get(`subscription/get-subscriptions-by-trainer/${trainerId}`),
    filterByDistance: (payload) => Api.post(`/subscription/get-subscriptions-by-coordinates`,payload),
    filterBySortBy: (payload) => Api.post(`/subscription/get-subscriptions-filter`,payload),
    filterBySearch: (search) => Api.get(`/subscription/search-subscriptions?keyword=${search}`),
};
