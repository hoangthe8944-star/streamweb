import { useEffect, useRef, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { ChatMessageDto } from "../api/chatApi";

// Lấy URL Hub từ env hoặc mặc định
const HUB_URL = (import.meta.env.VITE_API_URL ?? "http://localhost:5297")
  .replace("/api", "") + "/hubs/chat";

export function useChat(streamId: number) {
  // 1. Khai báo State (Đây là phần bị thiếu dẫn đến lỗi của bạn)
  const [messages, setMessages]   = useState<ChatMessageDto[]>([]);
  const [connected, setConnected] = useState(false);
  
  // Dùng Ref để giữ kết nối không bị khởi tạo lại khi re-render
  const connRef = useRef<signalR.HubConnection | null>(null);

  useEffect(() => {
    if (!streamId) return;

    const token = localStorage.getItem("token");

    // 2. Khởi tạo connection
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(HUB_URL, {
        accessTokenFactory: () => token ?? "",
        // Thử nghiệm bỏ qua lỗi SSL trên localhost nếu cần
        skipNegotiation: false,
        transport: signalR.HttpTransportType.WebSockets
      })
      .withAutomaticReconnect()
      .build();

    // 3. Đăng ký sự kiện nhận tin nhắn từ Server
    connection.on("ReceiveMessage", (msg: ChatMessageDto) => {
      console.log("Nhận tin nhắn mới từ SignalR:", msg);
      setMessages((prev) => [...prev, msg]);
    });

    connection.on("Error", (err: string) => {
      console.error("SignalR Chat Error:", err);
    });

    // 4. Bắt đầu kết nối
    connection.start()
      .then(() => {
        console.log("Đã kết nối SignalR thành công!");
        setConnected(true);
        // Tham gia vào phòng chat riêng của stream này
        connection.invoke("JoinStream", streamId);
      })
      .catch((err) => {
        console.error("Kết nối SignalR thất bại: ", err);
        setConnected(false);
      });

    connRef.current = connection;

    // 5. Cleanup khi rời trang hoặc streamId thay đổi
    return () => {
      if (connRef.current) {
        connRef.current.invoke("LeaveStream", streamId)
          .then(() => connRef.current?.stop())
          .catch(err => console.error(err));
      }
    };
  }, [streamId]);

  // Hàm gửi tin nhắn
  const sendMessage = async (message: string, type = "text") => {
    if (!connRef.current || !connected) {
      console.warn("Chưa kết nối SignalR, không thể gửi chat.");
      return;
    }
    
    try {
      await connRef.current.invoke("SendMessage", {
        streamId,
        message,
        type,
      });
    } catch (err) {
      console.error("Gửi tin nhắn thất bại:", err);
    }
  };

  // Trả về các giá trị cho Component sử dụng
  return { messages, connected, sendMessage };
}