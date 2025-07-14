import Api from "../Middleware/axios";

export const ClassesApi = {
    getAllClasses: (payload) => Api.post(`/subscription/get-subscriptions-filter`, payload),
    joinClass: (payload) => Api.post(`/package-booking/package-booking-join-class`, payload),
    getClassesSubByUser: () => Api.get(`/package-booking/get-all-joined-classes-user`)
};
