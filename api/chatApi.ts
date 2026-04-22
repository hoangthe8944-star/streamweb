// src/api/chatApi.ts
import api from "./axiosConfig";

export interface ChatMessageDto {
  id: number;
  streamId: number;
  userId: number;
  username: string;
  avatar?: string;
  message: string;
  type: "text" | "emoji" | "system";
  createdAt: string;
}

export interface SendChatRequest {
  streamId: number;
  message: string;
  type?: "text" | "emoji";
}

const chatApi = {
  /**
   * Lấy lịch sử chat của stream (load lần đầu)
   * GET /api/chat/:streamId?take=50
   */
  getMessages: (streamId: number, take = 50) =>
    api.get<ChatMessageDto[]>(`/chat/${streamId}`, { params: { take } }),

  /**
   * Gửi tin nhắn qua REST (fallback nếu không dùng SignalR)
   * POST /api/chat/send
   * Role: viewer / streamer (đã đăng nhập)
   */
  sendMessage: (data: SendChatRequest) =>
    api.post<ChatMessageDto>("/chat/send", data),
};

export default chatApi;

// ══════════════════════════════════════════════════════════
//  SIGNALR HOOK — src/hooks/useChat.ts
//  npm install @microsoft/signalr
// ══════════════════════════════════════════════════════════
// Tách ra file riêng: src/hooks/useChat.ts

/*
import { useEffect, useRef, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { ChatMessageDto } from "../api/chatApi";

const HUB_URL = (import.meta.env.VITE_API_URL ?? "http://localhost:5297")
  .replace("/api", "") + "/hubs/chat";

export function useChat(streamId: number) {
  const [messages, setMessages]   = useState<ChatMessageDto[]>([]);
  const [connected, setConnected] = useState(false);
  const connRef = useRef<signalR.HubConnection | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(HUB_URL, {
        accessTokenFactory: () => token ?? "",
      })
      .withAutomaticReconnect()
      .build();

    // Nhận tin nhắn mới
    connection.on("ReceiveMessage", (msg: ChatMessageDto) => {
      setMessages((prev) => [...prev, msg]);
    });

    connection.on("Error", (err: string) => {
      console.error("Chat error:", err);
    });

    connection.start().then(() => {
      setConnected(true);
      connection.invoke("JoinStream", streamId);
    });

    connRef.current = connection;

    return () => {
      connection.invoke("LeaveStream", streamId).finally(() => {
        connection.stop();
      });
    };
  }, [streamId]);

  const sendMessage = async (message: string, type = "text") => {
    if (!connRef.current || !connected) return;
    await connRef.current.invoke("SendMessage", {
      streamId,
      message,
      type,
    });
  };

  return { messages, connected, sendMessage };
}
*/