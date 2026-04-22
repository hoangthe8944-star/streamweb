/// <reference types="vite/client" />
import { useEffect, useRef, useState, useCallback } from "react";
import * as signalR from "@microsoft/signalr";

// 1. Định nghĩa Interface cho Tin nhắn (khớp với DTO backend của bạn)
export interface ChatMessageDto {
  id: number;
  streamId: number;
  userId: number;
  username: string;
  avatar?: string | null;
  message: string;
  type: "text" | "emoji";
  createdAt: string | Date;
}

// 2. Định nghĩa Request gửi đi
interface SendChatRequest {
  streamId: number;
  message: string;
  type: "text" | "emoji";
}

// 3. Định nghĩa kết quả trả về của Hook
interface UseChatReturn {
  messages: ChatMessageDto[];
  connected: boolean;
  sendMessage: (message: string, type?: "text" | "emoji") => Promise<void>;
  setMessages: React.Dispatch<React.SetStateAction<ChatMessageDto[]>>;
}

const HUB_URL: string = (
  (import.meta.env.VITE_API_URL as string) ?? "http://localhost:5297"
).replace("/api", "") + "/hubs/chat";

export function useChat(streamId: number): UseChatReturn {
  const connection = new signalR.HubConnectionBuilder()
  const [connected, setConnected] = useState<boolean>(false);
  const connRef = useRef<signalR.HubConnection | null>(null);

  useEffect(() => {
    const token: string | null = localStorage.getItem("token");

    // Khởi tạo connection
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(HUB_URL, {
        accessTokenFactory: () => token ?? "",
        // Thêm các cấu hình nâng cao để ổn định hơn
        skipNegotiation: false,
        transport: signalR.HttpTransportType.WebSockets
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    // Listener: Nhận tin nhắn mới
    connection.on("ReceiveMessage", (msg: ChatMessageDto) => {
      setMessages((prev) => [...prev, msg]);
    });

    // Listener: Nhận thông báo lỗi từ Hub
    connection.on("Error", (err: string) => {
      console.error("[SignalR Error Hub]:", err);
    });

    // Bắt đầu kết nối
    const startConnection = async () => {
      try {
        await connection.start();
        console.log("[SignalR] Connected to Chat Hub");

        setConnected(true);

        // Tham gia vào phòng chat của stream cụ thể
        await connection.invoke("JoinStream", streamId);
        console.log(`[SignalR] Joined Stream Room: ${streamId}`);
      } catch (err) {
        console.error("[SignalR] Connection/Join failed:", err);
        setConnected(false);
      }
    };

    startConnection();
    connRef.current = connection;

    // Cleanup: Khi streamId thay đổi hoặc component unmount
    return () => {
      if (connection) {
        connection.invoke("LeaveStream", streamId)
          .catch((err) => console.warn("[SignalR] LeaveStream failed:", err))
          .finally(() => {
            connection.stop();
            setConnected(false);
            // Reset tin nhắn khi chuyển stream
            setMessages([]);
          });
      }
    };
  }, [streamId]);

  // Hàm gửi tin nhắn
  const sendMessage = useCallback(
    async (message: string, type: "text" | "emoji" = "text"): Promise<void> => {
      if (!connRef.current || !connected) {
        console.warn("[SignalR] Cannot send message: Not connected");
        return;
      }

      try {
        const payload: SendChatRequest = { streamId, message, type };
        await connRef.current.invoke("SendMessage", payload);
      } catch (err) {
        console.error("[SignalR] SendMessage failed:", err);
        throw err; // Ném lỗi để UI có thể xử lý (ví dụ: hiện thông báo lỗi)
      }
    },
    [streamId, connected]
  );

  return { messages, connected, sendMessage, setMessages };
}