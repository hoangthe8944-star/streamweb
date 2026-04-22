// src/api/donationApi.ts
import api from "./axiosConfig";

export interface DonationDto {
  id: number;
  userId: number;
  username: string;
  streamerId: number;
  streamId?: number;
  amount: number;
  message?: string;
  createdAt: string;
}

export interface CreateDonationRequest {
  streamerId: number;
  streamId?: number;
  amount: number;
  message?: string;
}

const donationApi = {
  /**
   * Donate cho streamer
   * POST /api/donations
   * Role: viewer / streamer (đã đăng nhập)
   */
  donate: (data: CreateDonationRequest) =>
    api.post<DonationDto>("/donations", data),

  /**
   * Lịch sử donation đã gửi cho streamer (trang profile streamer)
   * GET /api/donations/streamer/:streamerId
   */
  getDonationsByStreamer: (streamerId: number) =>
    api.get<DonationDto[]>(`/donations/streamer/${streamerId}`),

  /**
   * Tổng donate của 1 streamer
   * GET /api/donations/streamer/:streamerId/total
   */
  getTotalDonation: (streamerId: number) =>
    api.get<number>(`/donations/streamer/${streamerId}/total`),
};

export default donationApi;

// ══════════════════════════════════════════════════════════
//  SUBSCRIPTION API — src/api/subscriptionApi.ts
// ══════════════════════════════════════════════════════════

export interface SubscriptionDto {
  id: number;
  userId: number;
  streamerId: number;
  streamerName: string;
  planId: number;
  planName: string;
  startDate: string;
  endDate: string;
  status: string;
}

export interface SubscriptionPlanDto {
  id: number;
  name: string;
  price: number;
  duration: number;
}

export interface CreateSubscriptionRequest {
  streamerId: number;
  planId: number;
}

export const subscriptionApi = {
  /**
   * Đăng ký subscribe streamer
   * POST /api/subscriptions
   */
  subscribe: (data: CreateSubscriptionRequest) =>
    api.post<SubscriptionDto>("/subscriptions", data),

  /**
   * Kiểm tra đã sub streamer này chưa
   * GET /api/subscriptions/:streamerId/status
   */
  isSubscribed: (streamerId: number) =>
    api.get<boolean>(`/subscriptions/${streamerId}/status`),

  /**
   * Danh sách sub đang có (trang "My Subscriptions")
   * GET /api/subscriptions/my
   */
  getMySubscriptions: () =>
    api.get<SubscriptionDto[]>("/subscriptions/my"),

  /**
   * Lấy danh sách gói sub của streamer
   * GET /api/subscriptions/plans/:streamerId  (cần thêm ở backend)
   */
  getPlansByStreamer: (streamerId: number) =>
    api.get<SubscriptionPlanDto[]>(`/subscriptions/plans/${streamerId}`),
};