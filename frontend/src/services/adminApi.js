import axios from "axios";

import { getStoredAdminToken, removeAdminSession } from "../utils/storage";

const adminApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

adminApi.interceptors.request.use((config) => {
  const token = getStoredAdminToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

adminApi.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      removeAdminSession();
    }
    return Promise.reject(error?.response?.data || { message: "Something went wrong" });
  }
);

export default adminApi;
