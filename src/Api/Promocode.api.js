import Api from "../Middleware/axios";

export const PromocodeApi = {
    getAllPromoCodes: () => Api.post(`/admin/get-all-promo-codes`),
};
