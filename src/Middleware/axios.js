// import axios from "axios";
import axios from "axios";
import { server } from "../config";

const instance = axios.create({
  baseURL: server,
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token !== null) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      localStorage.removeItem("token");
    }
    if (status === 403) {
      localStorage.clear();

      if (window.__persistor) {
        window.__persistor.purge();
      }
      alert("Your session has expired!!");
      window.location.reload();
    }

    return Promise.reject(error);
  }
);

export default instance;
