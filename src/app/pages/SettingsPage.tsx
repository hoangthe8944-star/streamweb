import { useState, useEffect } from "react";
import {
  User, Shield, Bell, Palette, Monitor, Globe, CreditCard, Copy, Check, RefreshCw
} from "lucide-react";
import streamApi from "../../../api/streamApi"; // Đảm bảo đúng path

type SettingsTab = "profile" | "security" | "notifications" | "appearance" | "privacy" | "subscriptions" | "creator";

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  
  // 🔥 STREAM KEY STATE
  const [showStreamKey, setShowStreamKey] = useState(false);
  const [streamKey, setStreamKey] = useState("");
  const [loadingKey, setLoadingKey] = useState(false);
  const [copied, setCopied] = useState(false);

  // 🔥 CALL API LẤY KEY
  const fetchKey = async () => {
    try {
      setLoadingKey(true);
      // Dùng tên hàm getMyKey (hoặc getMyStreamKey tùy bạn đặt trong streamApi.ts)
      const res = await streamApi.getMyKey(); 
      setStreamKey(res.data.streamKey);
    } catch (e) {
      console.error("Lỗi lấy stream key:", e);
      setStreamKey("Vui lòng đăng nhập lại...");
    } finally {
      setLoadingKey(false);
    }
  };

  useEffect(() => {
    // Chỉ gọi API khi người dùng ở Tab Creator hoặc khi Component mount
    fetchKey();
  }, []);

  // 🔥 CHỨC NĂNG RESET KEY
  const handleResetKey = async () => {
    if (!window.confirm("Bạn có chắc chắn muốn reset Stream Key không? Key cũ trong OBS sẽ không dùng được nữa.")) return;
    
    try {
      setLoadingKey(true);
      const res = await streamApi.resetMyKey();
      setStreamKey(res.data.streamKey);
      alert("Đã tạo Stream Key mới thành công!");
    } catch (e) {
      alert("Lỗi khi reset key");
    } finally {
      setLoadingKey(false);
    }
  };

  // 🔥 CHỨC NĂNG COPY
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "privacy", label: "Privacy", icon: Monitor },
    { id: "subscriptions", label: "Subscriptions", icon: CreditCard },
    { id: "creator", label: "Creator", icon: Globe },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-[#0e0e10] text-white">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-64">
            <nav className="bg-[#1f1f23] rounded p-2 space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as SettingsTab)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded text-left transition-colors ${
                      activeTab === tab.id ? "bg-purple-600" : "hover:bg-white/10"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="bg-[#1f1f23] rounded p-6 min-h-[500px]">
              
              {activeTab === "creator" && (
                <div className="space-y-8 animate-in fade-in duration-300">
                  <h2 className="text-2xl font-semibold mb-4">Creator Settings</h2>

                  {/* STREAM KEY SECTION */}
                  <div className="p-5 bg-[#0e0e10] rounded-lg border border-white/5">
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">Primary Stream Key</h3>
                        <p className="text-sm text-white/50">
                          Dán key này vào thiết lập OBS của bạn. Không được cho người khác xem.
                        </p>
                      </div>
                      <button 
                        onClick={handleResetKey}
                        className="flex items-center gap-2 text-xs text-purple-400 hover:text-purple-300"
                      >
                        <RefreshCw className="w-3 h-3" /> Reset Key
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <input
                          type={showStreamKey ? "text" : "password"}
                          value={loadingKey ? "Đang tải..." : streamKey}
                          readOnly
                          className="w-full bg-[#1f1f23] border border-white/10 rounded px-4 py-2.5 pr-10 focus:border-purple-500 outline-none"
                        />
                      </div>

                      <button
                        onClick={() => setShowStreamKey(!showStreamKey)}
                        className="px-4 py-2.5 bg-[#2c2c30] hover:bg-[#3a3a3d] rounded font-medium transition-colors"
                      >
                        {showStreamKey ? "Hide" : "Show"}
                      </button>

                      <button
                        onClick={() => copyToClipboard(streamKey)}
                        className="p-2.5 bg-purple-600 hover:bg-purple-700 rounded transition-colors"
                        title="Copy to clipboard"
                      >
                        {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* SERVER URL SECTION */}
                  <div className="p-5 bg-[#0e0e10] rounded-lg border border-white/5">
                    <h3 className="font-semibold mb-2">RTMP Server URL</h3>
                    <div className="flex items-center gap-2">
                      <input
                        value="rtmp://localhost:1935/live"
                        readOnly
                        className="flex-1 bg-[#1f1f23] border border-white/10 rounded px-4 py-2.5 outline-none"
                      />
                      <button
                        onClick={() => copyToClipboard("rtmp://localhost:1935/live")}
                        className="p-2.5 bg-[#2c2c30] hover:bg-[#3a3a3d] rounded"
                      >
                         <Copy className="w-5 h-5" />
                      </button>
                    </div>
                    <p className="text-xs text-white/40 mt-2 italic">
                      Lưu ý: Đảm bảo Node Media Server của bạn đang chạy.
                    </p>
                  </div>

                </div>
              )}

              {/* Các tab khác giữ nguyên như bạn đã viết... */}
              {activeTab === "profile" && (
                 <div>{/* Nội dung Profile của bạn */}</div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}