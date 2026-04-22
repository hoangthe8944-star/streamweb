import api from "./axiosConfig"; // Hoặc tên file config của bạn

// --- Định nghĩa Interfaces (DTOs) khớp với ASP.NET ---
export interface Stream {
  id: number;
  title: string;
  game: string;
  streamerName: string;   // Sửa từ channelName
  categoryName: string;   // Sửa từ game
  viewersCount: number;
  description?: string;
  thumbnail: string;
  isLive: boolean;
  streamKey?: string;
  streamerId: number;
  categoryId?: number;
}

export interface CreateStreamRequest {
  title: string;
  categoryId: number;
  description?: string;
}

export interface UpdateStreamRequest {
  title: string;
  categoryId: number;
  description?: string;
}

export interface StreamKeyResponse {
  streamKey: string;
}

export interface StreamKeyRequest {
  streamKey: string;
}

// --- API Implementation ---
export const streamApi = {
  // Lấy danh sách đang trực tuyến
  getLiveStreams: () =>
    api.get<Stream[]>("/Streams/live"),

  // Lấy chi tiết một stream
  getById: (id: number) =>
    api.get<Stream>(`/Streams/${id}`),

  // Tìm kiếm stream theo từ khóa hoặc thể loại
  search: (keyword?: string, categoryId?: number) =>
    api.get<Stream[]>("/Streams/search", { params: { keyword, categoryId } }),

  // Lấy danh sách stream của một streamer cụ thể
  getByStreamer: (streamerId: number) =>
    api.get<Stream[]>(`/Streams/streamer/${streamerId}`),

  // Tạo stream mới (Dành cho Streamer/Admin)
  create: (data: CreateStreamRequest) =>
    api.post<Stream>("/Streams", data),

  // Cập nhật thông tin stream
  update: (id: number, data: UpdateStreamRequest) =>
    api.put<Stream>(`/Streams/${id}`, data),

  // Bắt đầu live (bằng ID)
  start: (id: number) =>
    api.post<Stream>(`/Streams/${id}/start`),

  // Kết thúc live (bằng ID)
  stop: (id: number) =>
    api.post<Stream>(`/Streams/${id}/stop`),

  // Xóa stream
  delete: (id: number) =>
    api.delete(`/Streams/${id}`),

  // Lấy Stream Key của tôi
  getMyKey: () =>
    api.get<StreamKeyResponse>("/Streams/me/key"),

  // Reset Stream Key mới
  resetMyKey: () =>
    api.post<StreamKeyResponse>("/Streams/me/reset-key"),

  // Bắt đầu live (Dùng cho Webhook từ Node Media Server)
  startByKey: (data: StreamKeyRequest) =>
    api.post<Stream>("/Streams/start-by-key", data),

  // Kết thúc live (Dùng cho Webhook từ Node Media Server)
  stopByKey: (data: StreamKeyRequest) =>
    api.post<Stream>("/Streams/stop-by-key", data),
};
export default streamApi;