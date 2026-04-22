// src/api/followApi.ts
import api from "./axiosConfig";

export interface FollowDto {
  id: number;
  followerId: number;
  followingId: number;
  followingUsername: string;
  followingAvatar?: string;
  createdAt: string;
}

export interface NotificationDto {
  id: number;
  type: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

const followApi = {
  /**
   * Follow streamer
   * POST /api/follows/:followingId
   * Role: viewer / streamer (đã đăng nhập)
   */
  follow: (followingId: number) =>
    api.post(`/follows/${followingId}`),

  /**
   * Unfollow streamer
   * DELETE /api/follows/:followingId
   */
  unfollow: (followingId: number) =>
    api.delete(`/follows/${followingId}`),

  /**
   * Kiểm tra đang follow chưa (hiện nút Follow / Unfollow)
   * GET /api/follows/:followingId/status
   */
  isFollowing: (followingId: number) =>
    api.get<boolean>(`/follows/${followingId}/status`),

  /**
   * Danh sách streamer đang follow (trang "Following")
   * GET /api/follows/following
   */
  getFollowing: () =>
    api.get<FollowDto[]>("/follows/following"),

  /**
   * Số lượng follower của 1 streamer (hiện trên profile)
   * GET /api/follows/:userId/count
   */
  getFollowerCount: (userId: number) =>
    api.get<number>(`/follows/${userId}/count`),
};

export default followApi;

// ══════════════════════════════════════════════════════════
//  NOTIFICATION API — src/api/notificationApi.ts
// ══════════════════════════════════════════════════════════

export const notificationApi = {
  /**
   * Lấy thông báo của user hiện tại
   * GET /api/notifications          (cần thêm endpoint ở backend)
   * GET /api/notifications?unreadOnly=true
   */
  getNotifications: (unreadOnly = false) =>
    api.get<NotificationDto[]>("/notifications", {
      params: { unreadOnly },
    }),

  /**
   * Đánh dấu tất cả đã đọc
   * PUT /api/notifications/read-all  (cần thêm endpoint ở backend)
   */
  markAllRead: () =>
    api.put("/notifications/read-all"),
};