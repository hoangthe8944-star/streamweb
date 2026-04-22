import { useState } from "react";
import { Send, Smile, Settings } from "lucide-react";
import { EmojiPicker } from "./EmojiPicker";

const CHAT_MESSAGES = [
  { username: "viewer123", message: "This is amazing!", badge: "subscriber" },
  { username: "gamer456", message: "Let's go!!", badge: null },
  { username: "fan789", message: "You got this!", badge: "moderator" },
  { username: "cool_user", message: "What a play!", badge: "subscriber" },
  { username: "streamer_fan", message: "POG", badge: null },
  { username: "game_master", message: "That was insane!", badge: "subscriber" },
  { username: "viewer999", message: "GGWP", badge: null },
];

interface ChatPanelProps {
  channelName: string;
}

export function ChatPanel({ channelName }: ChatPanelProps) {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      console.log("Send message:", message);
      setMessage("");
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessage((prev) => prev + emoji);
  };

  const getBadgeColor = (badge: string | null) => {
    if (badge === "subscriber") return "bg-purple-600";
    if (badge === "moderator") return "bg-green-600";
    return "";
  };

  return (
    <div className="w-full lg:w-80 xl:w-96 bg-[#0e0e10] border-l border-white/10 flex flex-col">
      <div className="p-3 border-b border-white/10 flex items-center justify-between">
        <h3 className="font-semibold">Stream Chat</h3>
        <button className="p-1 hover:bg-white/10 rounded">
          <Settings className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {CHAT_MESSAGES.map((msg, index) => (
          <div key={index} className="flex gap-2 text-sm">
            {msg.badge && (
              <span
                className={`px-1.5 py-0.5 rounded text-xs ${getBadgeColor(
                  msg.badge
                )} flex-shrink-0 h-fit`}
              >
                {msg.badge === "subscriber" ? "SUB" : "MOD"}
              </span>
            )}
            <div className="min-w-0">
              <span className="font-semibold text-purple-400">
                {msg.username}:
              </span>{" "}
              <span className="text-white/90 break-words">{msg.message}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 border-t border-white/10 relative">
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={`Send a message in ${channelName}'s chat`}
            className="flex-1 bg-[#1f1f23] border border-white/20 rounded px-3 py-2 text-sm focus:outline-none focus:border-white/40"
          />
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-2 hover:bg-white/10 rounded"
          >
            <Smile className="w-5 h-5" />
          </button>
          <button
            type="submit"
            className="p-2 bg-purple-600 hover:bg-purple-700 rounded"
          >
            <Send className="w-5 h-5" />
          </button>
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
