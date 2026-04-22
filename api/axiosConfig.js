// src/api/axiosConfig.ts
import axios from "axios";

// 🔥 2 API
const LOCAL_API = import.meta.env.VITE_API_URL || "https://localhost:7100/api";
const PROD_API = "https://asp-vroo.onrender.com/api";

// 🔥 instance
const api = axios.create({
  baseURL: LOCAL_API,
  headers: { "Content-Type": "application/json" },
  timeout: 5000,
});

// =======================
// 🛡 REQUEST INTERCEPTOR
// =======================
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// =======================
// 🔄 RESPONSE INTERCEPTOR
// =======================
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    // 🔥 401 → logout
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/login";
      return Promise.reject(error);
    }

    // 🔥 NETWORK ERROR → fallback sang server deploy
    if (
      error.code === "ERR_NETWORK" &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      console.log("🔄 Local API lỗi → chuyển sang server deploy");

      originalRequest.baseURL = PROD_API;

      return api(originalRequest);
    }

    return Promise.reject(error);
  }
);

export default api;