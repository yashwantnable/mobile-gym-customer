import Api from "../Middleware/axios";

export const PackagesApi = {
    getpackages: () => Api.post("package/get-all-packages"),
    packageBooking: (payload) => Api.post(`package-booking/create-package-booking`, payload),
    packageBookingActivation: (bookingId) => Api.post(`package-booking/package-booking-activation/${bookingId}`),
    getPackageById: (id) => Api.get(`package-booking/get-package-booking-by-id/${id} `),
    getUserPackage: (userId) => Api.get(`package-booking/get-package-booking-by-user-id/${userId}`)
};
