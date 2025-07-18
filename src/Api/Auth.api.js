import Api from "../Middleware/axios";

export const AuthApi = {
  register: (payload) => Api.post("auth/register", payload),
  login: (payload) => Api.post("auth/login/3", payload),
  country: () => Api.get("master/get-all-country"),
  city: (countryId) => Api.get(`master/get-all-city/${countryId}`),
  getuserProfile: (id) => Api.get(`user/get-userby-id/${id}`),
  updateProfile: (playlaod) => Api.put("user/update-user", playlaod),
};
