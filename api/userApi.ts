// src/api/userApi.ts
import api from "./axiosConfig";

export interface UserDto {
  id: number;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  role: string;
  status: string;
  createdAt: string;
}

export interface UpdateUserRequest {
  avatar?: string;
  bio?: string;
}

export interface UserProfileDto {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
}

const userApi = {
  /**
   * Lấy thông tin bản thân
   * GET /api/users/me
   */
  getMe: () =>
    api.get<UserDto>("/users/me"),

  /**
   * Lấy thông tin user bất kỳ (xem profile streamer)
   * GET /api/users/:id
   */
  getUserById: (id: number) =>
    api.get<UserDto>(`/users/${id}`),

  /**
   * Cập nhật avatar, bio
   * PUT /api/users/me
   */
  updateProfile: (data: UpdateUserRequest) =>
    api.put<UserDto>("/users/me", data),
};

export default userApi;