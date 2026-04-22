// src/api/authApi.ts
import api from "./axiosConfig";

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  role: string;
  userId: number;
}

const authApi = {
  /**
   * Đăng ký tài khoản mới
   * POST /api/auth/register
   */
  register: (data: RegisterRequest) =>
    api.post<AuthResponse>("/auth/register", data),

  /**
   * Đăng nhập
   * POST /api/auth/login
   */
  login: (data: LoginRequest) =>
    api.post<AuthResponse>("/auth/login", data),
};

export default authApi;