import axios from "axios";

import { getStoredToken, removeSession } from "../utils/storage";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Attach token
api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Handle response globally
api.interceptors.response.use(
  (response) => {
    // 🔥 IMPORTANT: unwrap backend response
    return response.data;
  },
  (error) => {
    if (error?.response?.status === 401) {
      removeSession();
    }

    // ✅ Standardized error
    return Promise.reject(
      error?.response?.data || { message: "Something went wrong" }
    );
  }
);

export default api;