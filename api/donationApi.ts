import api from "./axiosConfig";

export interface DonationDto {
  id: number;
  userId: number;
  username: string;
  streamerId: number;
  streamId?: number;
  amount: number;
  message?: string;
  paymentMethod?: string;
  createdAt: string;
}

export interface CreateDonationRequest {
  streamerId: number;
  streamId?: number;
  amount: number;
  message?: string;
  paymentMethod?: string;
}

const donationApi = {
  donate: (data: CreateDonationRequest) =>
    api.post<DonationDto>("/donations", data),

  getDonationsByStreamer: (streamerId: number) =>
    api.get<DonationDto[]>(`/donations/streamer/${streamerId}`),

  getDonationsByStream: (streamId: number) =>
    api.get<DonationDto[]>(`/donations/stream/${streamId}`),

  getTotalDonation: (streamerId: number) =>
    api.get<number>(`/donations/streamer/${streamerId}/total`),
};

export default donationApi;

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
  subscribe: (data: CreateSubscriptionRequest) =>
    api.post<SubscriptionDto>("/subscriptions", data),

  isSubscribed: (streamerId: number) =>
    api.get<boolean>(`/subscriptions/${streamerId}/status`),

  getMySubscriptions: () =>
    api.get<SubscriptionDto[]>("/subscriptions/my"),

  getPlansByStreamer: (streamerId: number) =>
    api.get<SubscriptionPlanDto[]>(`/subscriptions/plans/${streamerId}`),
};
