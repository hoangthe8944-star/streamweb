import { useState, useEffect, useRef } from "react";
import {
  User, Shield, Bell, Palette, Monitor, Globe,
  CreditCard, Copy, Check, RefreshCw, Upload, ImageIcon, X, Loader2
} from "lucide-react";
import streamApi from "../../../api/streamApi";

type SettingsTab = "profile" | "security" | "notifications" | "appearance" | "privacy" | "subscriptions" | "creator";

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");

  // ── Stream Data State ────────────────────────────────
  const [streamId,      setStreamId]      = useState<number | null>(null);
  const [showStreamKey, setShowStreamKey] = useState(false);
  const [streamKey,     setStreamKey]     = useState("");
  const [loadingData,   setLoadingData]   = useState(false);
  const [copied,        setCopied]        = useState(false);

  // ── Thumbnail State ───────────────────────────────────
  const [thumbnail,         setThumbnail]         = useState<string>("");
  const [uploadingThumb,    setUploadingThumb]    = useState(false);
  const [thumbError,        setThumbError]        = useState<string | null>(null);
  const [dragOver,          setDragOver]          = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. Load dữ liệu khi vào trang
  const loadInitialData = async () => {
    try {
      setLoadingData(true);
      const userStr = localStorage.getItem("user");
      if (!userStr) return;
      const currentUser = JSON.parse(userStr);

      // Lấy key
      const keyRes = await streamApi.getMyKey();
      setStreamKey(keyRes.data.streamKey);

      // Lấy thông tin Stream (để lấy ID và Thumbnail hiện tại)
      const streamRes = await streamApi.getStreamByStreamer(currentUser.userId);
      if (streamRes.data && streamRes.data.length > 0) {
        const myStream = streamRes.data[0];
        setStreamId(myStream.id);
        setThumbnail(myStream.thumbnail || "");
      }
    } catch (err) {
      console.error("Lỗi load dữ liệu cài đặt:", err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => { loadInitialData(); }, []);

  // 2. Logic xử lý Ảnh: Chọn file -> Upload -> Lưu DB ngay lập tức
  const handleThumbnailProcess = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setThumbError("Chỉ chấp nhận file ảnh (jpg, png, webp)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setThumbError("Ảnh tối đa 5MB");
      return;
    }

    setThumbError(null);
    setUploadingThumb(true);

    try {
      // Bước 1: Upload file lên server
      const uploadRes = await streamApi.uploadThumbnail(file);
      const newUrl = uploadRes.data.url;

      // Bước 2: Lưu URL vào Database của Stream
      if (streamId) {
        await streamApi.updateStream(streamId, { thumbnail: newUrl });
        setThumbnail(newUrl);
        alert("Đã cập nhật ảnh bìa thành công!");
      }
    } catch (err) {
      setThumbError("Lỗi khi tải ảnh lên. Vui lòng thử lại.");
    } finally {
      setUploadingThumb(false);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleThumbnailProcess(file);
    e.target.value = ""; 
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleThumbnailProcess(file);
  };

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleResetKey = async () => {
    if (!window.confirm("Reset Stream Key? Key cũ trong OBS sẽ không dùng được nữa.")) return;
    try {
      const res = await streamApi.resetMyKey();
      setStreamKey(res.data.streamKey);
      alert("Đã cấp mã mới!");
    } catch {
      alert("Lỗi khi reset key");
    }
  };

  const tabs = [
    { id: "profile",       label: "Profile",       icon: User       },
    { id: "security",      label: "Security",      icon: Shield     },
    { id: "notifications", label: "Notifications", icon: Bell       },
    { id: "appearance",    label: "Appearance",    icon: Palette    },
    { id: "privacy",       label: "Privacy",       icon: Monitor    },
    { id: "subscriptions", label: "Subscriptions", icon: CreditCard },
    { id: "creator",       label: "Creator",       icon: Globe      },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-[#0e0e10] text-white">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Tabs */}
          <div className="lg:w-64 shrink-0">
            <nav className="bg-[#1f1f23] rounded-lg p-2 space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as SettingsTab)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-md text-left transition-all ${
                      activeTab === tab.id ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20" : "hover:bg-white/10 text-white/60"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            <div className="bg-[#1f1f23] rounded-lg border border-white/5 p-6 min-h-[600px]">

              {/* ── TABS KHÁC (GIỮ NGUYÊN) ── */}
              {activeTab !== "creator" && (
                <div className="flex flex-col items-center justify-center h-full py-20 text-white/20 italic">
                   <p>Cài đặt {activeTab} đang được cập nhật...</p>
                </div>
              )}

              {/* ── CREATOR TAB (NỘI DUNG CHÍNH) ── */}
              {activeTab === "creator" && (
                <div className="space-y-8 animate-in fade-in duration-500">
                  <div>
                    <h2 className="text-2xl font-bold mb-1 text-purple-400">Creator Dashboard</h2>
                    <p className="text-sm text-white/40">Quản lý các thông số kỹ thuật cho buổi phát sóng của bạn.</p>
                  </div>

                  {/* 1. Stream Key Section */}
                  <div className="p-5 bg-[#0e0e10] rounded-xl border border-white/5 space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-bold text-lg">Mã khóa luồng chính</h3>
                        <p className="text-xs text-white/40 italic">Dùng mã này để kết nối với phần mềm OBS / FFmpeg.</p>
                      </div>
                      <button
                        onClick={handleResetKey}
                        className="flex items-center gap-1.5 text-xs text-purple-400 hover:underline"
                      >
                        <RefreshCw className="w-3.5 h-3.5" /> Reset mã mới
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type={showStreamKey ? "text" : "password"}
                        value={streamKey}
                        readOnly
                        className="flex-1 bg-[#1f1f23] border border-white/10 rounded-lg px-4 py-3 font-mono text-purple-500 outline-none"
                      />
                      <button
                        onClick={() => setShowStreamKey(!showStreamKey)}
                        className="px-4 py-3 bg-[#2c2c30] hover:bg-[#3a3a3d] rounded-lg text-xs font-bold transition-all"
                      >
                        {showStreamKey ? "ẨN" : "HIỆN"}
                      </button>
                      <button
                        onClick={() => copyText(streamKey)}
                        className="p-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-all"
                      >
                        {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* 2. Thumbnail Section (Đã cải tiến) */}
                  <div className="p-5 bg-[#0e0e10] rounded-xl border border-white/5">
                    <h3 className="font-bold text-lg mb-1">Ảnh bìa Livestream</h3>
                    <p className="text-xs text-white/40 mb-5">Ảnh này sẽ hiển thị ở trang chủ khi bạn đang phát sóng.</p>

                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Preview Box */}
                      <div className="w-full md:w-64 shrink-0">
                        <div className="relative aspect-video bg-[#1f1f23] rounded-lg overflow-hidden border border-white/10 group">
                          {thumbnail ? (
                            <>
                              <img src={thumbnail} alt="Preview" className="w-full h-full object-cover" />
                              <button
                                onClick={() => setThumbnail("")}
                                className="absolute top-2 right-2 p-1.5 bg-black/80 hover:bg-red-600 rounded-full transition-all"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-white/10">
                              <ImageIcon className="w-10 h-10" />
                              <span className="text-[10px] font-bold uppercase tracking-widest">No Image</span>
                            </div>
                          )}
                          {uploadingThumb && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                              <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                            </div>
                          )}
                        </div>
                        {thumbnail && <p className="mt-2 text-[10px] text-white/20 truncate">{thumbnail}</p>}
                      </div>

                      {/* Normal Upload Picker */}
                      <div
                        className={`flex-1 border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all ${
                          dragOver ? "border-purple-500 bg-purple-500/5" : "border-white/5 hover:border-white/20 hover:bg-white/5"
                        }`}
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={onDrop}
                      >
                        <div className="p-4 bg-purple-500/10 rounded-full">
                           <Upload className="w-8 h-8 text-purple-500" />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-bold">Chọn ảnh từ thư mục máy tính</p>
                          <p className="text-xs text-white/30 mt-1">Hoặc kéo thả file vào đây (Tối đa 5MB)</p>
                        </div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          hidden
                          accept="image/*"
                          onChange={onFileChange}
                        />
                      </div>
                    </div>
                    {thumbError && <p className="mt-4 text-xs text-red-500 font-medium flex items-center gap-2"><X className="w-3 h-3" /> {thumbError}</p>}
                  </div>

                  {/* 3. Server URL Section */}
                  <div className="p-5 bg-[#0e0e10] rounded-xl border border-white/5">
                    <h3 className="font-bold mb-3">RTMP Server Endpoint</h3>
                    <div className="flex items-center gap-2 bg-[#1f1f23] p-3 rounded-lg border border-white/5">
                      <code className="flex-1 text-xs text-white/50">rtmp://localhost:1935/live</code>
                      <button onClick={() => copyText("rtmp://localhost:1935/live")} className="hover:text-purple-500 transition-colors">
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}