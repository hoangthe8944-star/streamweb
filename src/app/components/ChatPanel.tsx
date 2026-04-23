import { useState, useEffect, useRef } from "react";
import { Send, Smile, Settings, Loader2 } from "lucide-react";
import { EmojiPicker } from "./EmojiPicker";
import chatApi, { ChatMessageDto } from "../../../api/chatApi";
import { useChat } from "../../hooks/useChat"; // Đảm bảo đường dẫn này đúng

interface ChatPanelProps {
  channelName: string;
  streamId: number; // Thêm prop này để kết nối SignalR
}

export function ChatPanel({ channelName, streamId }: ChatPanelProps) {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);

  // 1. Sử dụng Custom Hook SignalR
  const { messages: liveMessages, connected, sendMessage: sendSignalRMessage } = useChat(streamId);
  const [allMessages, setAllMessages] = useState<ChatMessageDto[]>([]);

  const scrollRef = useRef<HTMLDivElement>(null);

  // 2. Lấy lịch sử chat khi vào phòng
  useEffect(() => {
    // QUAN TRỌNG: Chỉ chạy logic bên dưới nếu streamId có giá trị thực (khác 0, null, undefined)
    if (!streamId) {
      console.log("ChatPanel: Đang đợi streamId...");
      return;
    }

    const fetchHistory = async () => {
      try {
        setHistoryLoading(true);
        console.log(`Đang lấy lịch sử chat cho streamId: ${streamId}`);
        const res = await chatApi.getMessages(streamId, 50);
        setAllMessages(res.data);
      } catch (err) {
        console.error("Lỗi lấy lịch sử chat:", err);
      } finally {
        setHistoryLoading(false);
      }
    };

    fetchHistory();
  }, [streamId]); // Theo dõi sự thay đổi của streamId
  // 3. Hợp nhất tin nhắn lịch sử và tin nhắn live
  useEffect(() => {
    if (liveMessages.length > 0) {
      // Chỉ lấy tin nhắn mới nhất từ liveMessages để tránh trùng lặp nếu cần
      setAllMessages((prev) => [...prev, liveMessages[liveMessages.length - 1]]);
    }
  }, [liveMessages]);

  // 4. Tự động cuộn xuống cuối khi có tin nhắn mới
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [allMessages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && connected) {
      try {
        // Gửi qua SignalR
        await sendSignalRMessage(message, "text");
        setMessage("");
      } catch (err) {
        console.error("Lỗi gửi tin nhắn:", err);
      }
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessage((prev) => prev + emoji);
  };

  return (
    <div className="w-full lg:w-80 xl:w-96 bg-[#0e0e10] border-l border-white/10 flex flex-col h-full">
      {/* Header */}
      <div className="p-3 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm uppercase tracking-wider text-white/70">Stream Chat</h3>
          {!connected && <Loader2 className="w-3 h-3 animate-spin text-yellow-500" />}
        </div>
        <button className="p-1 hover:bg-white/10 rounded">
          <Settings className="w-4 h-4 text-white/50" />
        </button>
      </div>

      {/* Chat Messages Area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar"
      >
        {historyLoading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
          </div>
        ) : (
          allMessages.map((msg) => (
            <div key={msg.id || msg.createdAt} className="flex flex-col text-sm animate-in fade-in slide-in-from-bottom-1">
              <div className="flex items-baseline gap-2">
                <span className="font-bold text-purple-400 shrink-0">
                  {msg.username}:
                </span>
                <span className="text-white/90 break-words line-clamp-5">
                  {msg.message}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input Area */}
      <div className="p-3 border-t border-white/10 relative bg-[#0e0e10]">
        <form onSubmit={handleSend} className="flex flex-col gap-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={!connected}
              placeholder={connected ? `Send a message...` : "Connecting to chat..."}
              className="flex-1 bg-[#1f1f23] border border-white/10 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 disabled:opacity-50"
            />
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-2 hover:bg-white/10 rounded-md transition-colors text-white/60"
            >
              <Smile className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-[10px] text-white/20 uppercase font-bold">
              {connected ? "Connected" : "Disconnected"}
            </div>
            <button
              type="submit"
              disabled={!message.trim() || !connected}
              className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 disabled:bg-white/5 disabled:text-white/20 rounded-md text-xs font-bold transition-all"
            >
              CHAT
            </button>
          </div>
        </form>

        <EmojiPicker
          isOpen={showEmojiPicker}
          onClose={() => setShowEmojiPicker(false)}
          onSelect={handleEmojiSelect}
        />
      </div>
    </div>
  );
}