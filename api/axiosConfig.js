// src/api/axiosConfig.ts
import axios from "axios";

// 🔥 2 API
const LOCAL_API = import.meta.env.VITE_API_URL || "https://localhost:7100/api";
const PROD_API = "https://asp-vroo.onrender.com/api";

// 🔥 instance
const api = axios.create({
  baseURL: LOCAL_API,
  headers: { 
    "Content-Type": "application/json",
    // 🛡️ THÊM DÒNG NÀY: Để vượt qua trang cảnh báo của Ngrok
    "ngrok-skip-browser-warning": "true" 
  },
  timeout: 10000, // Tăng lên 10s vì Render/Ngrok khởi động đôi khi hơi chậm
});

// =======================
// 🛡 REQUEST INTERCEPTOR
// =======================
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  
  // Đảm bảo mọi request gửi đi (kể cả khi retry) đều có header ngrok
  config.headers["ngrok-skip-browser-warning"] = "true";
  
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

    // 🔥 LỖI MẠNG HOẶC CORS (CORS cũng gây ra ERR_NETWORK)
    if (
      (error.code === "ERR_NETWORK" || !error.response) && 
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      console.warn("🔄 API hiện tại lỗi (CORS/Network) → Chuyển sang server dự phòng (Render)");

      // Thay đổi URL sang Render
      originalRequest.baseURL = PROD_API;
      
      // Quan trọng: Phải cập nhật lại URL đầy đủ nếu originalRequest.url là đường dẫn tương đối
      return api(originalRequest);
    }

    return Promise.reject(error);
  }
);

export default api;