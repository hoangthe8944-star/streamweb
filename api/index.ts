// src/api/index.ts
// ── Export tất cả API modules ─────────────────────────────

export { default as authApi }     from "./authApi";
export { default as userApi }     from "./userApi";
export { default as streamApi }   from "./streamApi";
export { default as chatApi }     from "./chatApi";
export { default as followApi }   from "./followApi";
export { default as donationApi } from "./donationApi";

export { notificationApi }        from "./followApi";
export { subscriptionApi }        from "./donationApi";

// ── Export types ──────────────────────────────────────────
export type { RegisterRequest, LoginRequest, AuthResponse } from "./authApi";
export type { UserDto, UpdateUserRequest }                  from "./userApi";
export type { Stream, CreateStreamRequest, UpdateStreamRequest, StreamKeyResponse } from "./streamApi";
export type { ChatMessageDto, SendChatRequest }             from "./chatApi";
export type { FollowDto, NotificationDto }                  from "./followApi";
export type { DonationDto, CreateDonationRequest, SubscriptionDto, SubscriptionPlanDto } from "./donationApi";