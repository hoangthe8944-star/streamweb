import api from "./axiosConfig";

export interface Stream {
  id: number;
  title: string;
  game?: string;
  streamerName: string;
  categoryName?: string;
  viewersCount: number;
  description?: string;
  thumbnail?: string;
  isLive?: boolean;
  status?: string;
  streamKey?: string;
  streamerId: number;
  categoryId?: number;
  startedAt?: string;
  tags?: string[];
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

export const streamApi = {
  getLiveStreams: () => api.get<Stream[]>("/Streams/live"),

  getById: (id: number) => api.get<Stream>(`/Streams/${id}`),

  search: (keyword?: string, categoryId?: number) =>
    api.get<Stream[]>("/Streams/search", { params: { keyword, categoryId } }),

  getByStreamer: (streamerId: number) =>
    api.get<Stream[]>(`/Streams/streamer/${streamerId}`),

  create: (data: CreateStreamRequest) => api.post<Stream>("/Streams", data),

  update: (id: number, data: UpdateStreamRequest) =>
    api.put<Stream>(`/Streams/${id}`, data),

  start: (id: number) => api.post<Stream>(`/Streams/${id}/start`),

  stop: (id: number) => api.post<Stream>(`/Streams/${id}/stop`),

  delete: (id: number) => api.delete(`/Streams/${id}`),

  getMyKey: () => api.get<{ streamKey: string }>("/streams/me/key"),

  resetMyKey: () => api.post<{ streamKey: string }>("/streams/me/reset-key"),

  uploadThumbnail: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post<{ url: string }>("/streams/upload/thumbnail", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  startByKey: (data: StreamKeyRequest) =>
    api.post<Stream>("/Streams/start-by-key", data),

  stopByKey: (data: StreamKeyRequest) =>
    api.post<Stream>("/Streams/stop-by-key", data),
};

export default streamApi;
