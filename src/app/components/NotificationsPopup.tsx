import { X, Check } from "lucide-react";
import { useState } from "react";

interface Notification {
  id: number;
  type: "follow" | "subscription" | "raid" | "live" | "clip";
  username?: string;
  message: string;
  time: string;
  read: boolean;
  thumbnail?: string;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    type: "live",
    username: "StreamerPro",
    message: "StreamerPro is now live!",
    time: "2m ago",
    read: false,
    thumbnail: "https://picsum.photos/seed/notif1/80/80",
  },
  {
    id: 2,
    type: "follow",
    username: "NewViewer123",
    message: "NewViewer123 followed you",
    time: "15m ago",
    read: false,
  },
  {
    id: 3,
    type: "subscription",
    username: "LoyalFan",
    message: "LoyalFan subscribed to your channel",
    time: "1h ago",
    read: false,
  },
  {
    id: 4,
    type: "clip",
    username: "ClipMaster",
    message: "ClipMaster created a clip from your stream",
    time: "2h ago",
    read: true,
    thumbnail: "https://picsum.photos/seed/notif2/80/80",
  },
  {
    id: 5,
    type: "raid",
    username: "BigStreamer",
    message: "BigStreamer raided your channel with 500 viewers!",
    time: "3h ago",
    read: true,
  },
];

interface NotificationsPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationsPopup({ isOpen, onClose }: NotificationsPopupProps) {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const getNotificationIcon = (type: string) => {
    const colors = {
      follow: "bg-blue-600",
      subscription: "bg-purple-600",
      raid: "bg-red-600",
      live: "bg-red-500",
      clip: "bg-green-600",
    };
    return colors[type as keyof typeof colors] || "bg-gray-600";
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Popup */}
      <div className="fixed top-16 right-4 w-96 max-h-[600px] bg-[#0e0e10] border border-white/20 rounded-lg shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Notifications</h2>
            {unreadCount > 0 && (
              <p className="text-sm text-white/60">{unreadCount} unread</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-sm text-purple-400 hover:text-purple-300"
              >
                Mark all as read
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/10 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-white/60">
              <p>No notifications yet</p>
            </div>
          ) : (
            <div>
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => markAsRead(notif.id)}
                  className={`p-4 border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors ${
                    !notif.read ? "bg-purple-600/10" : ""
                  }`}
                >
                  <div className="flex gap-3">
                    {notif.thumbnail ? (
                      <img
                        src={notif.thumbnail}
                        alt=""
                        className="w-12 h-12 rounded object-cover"
                      />
                    ) : (
                      <div
                        className={`w-12 h-12 rounded ${getNotificationIcon(
                          notif.type
                        )} flex items-center justify-center font-bold`}
                      >
                        {notif.username?.charAt(0).toUpperCase() || "N"}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm mb-1">{notif.message}</p>
                      <p className="text-xs text-white/60">{notif.time}</p>
                    </div>
                    {!notif.read && (
                      <div className="w-2 h-2 bg-purple-600 rounded-full mt-2" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-white/10 text-center">
          <button className="text-sm text-purple-400 hover:text-purple-300">
            View All Notifications
          </button>
        </div>
      </div>
    </>
  );
}
