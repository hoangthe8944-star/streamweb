import { useState, useEffect, useRef } from "react";
import {
  User, Shield, Bell, Palette, Monitor, Globe,
  CreditCard, Copy, Check, RefreshCw, Upload, ImageIcon, X, Loader2
} from "lucide-react";
import streamApi from "../../../api/streamApi";
import { DEFAULT_STREAM_IMAGE } from "../utils/streamThumbnail";
import { getThumbnailServerUrl } from "../utils/mediaUrl";

type SettingsTab = "profile" | "security" | "notifications" | "appearance" | "privacy" | "subscriptions" | "creator";

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [showStreamKey, setShowStreamKey] = useState(false);
  const [streamKey, setStreamKey] = useState("");
  const [copied, setCopied] = useState(false);
  const [thumbnail, setThumbnail] = useState<string>("");
  const [uploadingThumb, setUploadingThumb] = useState(false);
  const [thumbError, setThumbError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getPreviewThumbnail = () => {
    if (thumbnail && thumbnail.startsWith("http")) {
      return thumbnail;
    }

    if (!streamKey) {
      return DEFAULT_STREAM_IMAGE;
    }

    const thumbnailServerUrl = getThumbnailServerUrl();
    if (!thumbnailServerUrl) {
      return DEFAULT_STREAM_IMAGE;
    }

    return `${thumbnailServerUrl}/thumbnails/${streamKey}.jpg?v=${Date.now()}`;
  };

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const userStr = localStorage.getItem("user");
        if (!userStr) return;

        const currentUser = JSON.parse(userStr);
        const currentUserId = currentUser.userId ?? currentUser.id;

        if (!currentUserId) return;

        const keyRes = await streamApi.getMyKey();
        setStreamKey(keyRes.data.streamKey);

        const streamRes = await streamApi.getByStreamer(currentUserId);
        if (streamRes.data.length > 0) {
          setThumbnail(streamRes.data[0].thumbnail || "");
        }
      } catch (err) {
        console.error("Loi load du lieu cai dat:", err);
      }
    };

    loadInitialData();
  }, []);

  const handleThumbnailProcess = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setThumbError("Chi chap nhan file anh (jpg, png, webp)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setThumbError("Anh toi da 5MB");
      return;
    }

    setThumbError(null);
    setUploadingThumb(true);

    try {
      const uploadRes = await streamApi.uploadThumbnail(file);
      setThumbnail(uploadRes.data.url);
      alert("Da tai anh bia len thanh cong!");
    } catch (err) {
      console.error("Loi upload anh:", err);
      setThumbError("Loi khi tai anh len. Vui long thu lai.");
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
    if (!window.confirm("Reset Stream Key? Key cu trong OBS se khong dung duoc nua.")) return;

    try {
      const res = await streamApi.resetMyKey();
      setStreamKey(res.data.streamKey);
      alert("Da cap ma moi!");
    } catch {
      alert("Loi khi reset key");
    }
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
          <div className="lg:w-64 shrink-0">
            <nav className="bg-[#1f1f23] rounded-lg p-2 space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as SettingsTab)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-md text-left transition-all ${activeTab === tab.id ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20" : "hover:bg-white/10 text-white/60"}`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="flex-1">
            <div className="bg-[#1f1f23] rounded-lg border border-white/5 p-6 min-h-[600px]">
              {activeTab !== "creator" && (
                <div className="flex flex-col items-center justify-center h-full py-20 text-white/20 italic">
                  <p>Cai dat {activeTab} dang duoc cap nhat...</p>
                </div>
              )}

              {activeTab === "creator" && (
                <div className="space-y-8 animate-in fade-in duration-500">
                  <div>
                    <h2 className="text-2xl font-bold mb-1 text-purple-400">Creator Dashboard</h2>
                    <p className="text-sm text-white/40">Quan ly cac thong so ky thuat cho buoi phat song cua ban.</p>
                  </div>

                  <div className="p-5 bg-[#0e0e10] rounded-xl border border-white/5 space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-bold text-lg">Ma khoa luong chinh</h3>
                        <p className="text-xs text-white/40 italic">Dung ma nay de ket noi voi OBS / FFmpeg.</p>
                      </div>
                      <button onClick={handleResetKey} className="flex items-center gap-1.5 text-xs text-purple-400 hover:underline">
                        <RefreshCw className="w-3.5 h-3.5" /> Reset ma moi
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
                        {showStreamKey ? "AN" : "HIEN"}
                      </button>
                      <button onClick={() => copyText(streamKey)} className="p-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-all">
                        {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="p-5 bg-[#0e0e10] rounded-xl border border-white/5">
                    <h3 className="font-bold text-lg mb-1">Anh bia Livestream</h3>
                    <p className="text-xs text-white/40 mb-5">Anh nay se hien thi o trang chu khi ban dang phat song.</p>

                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="w-full md:w-64 shrink-0">
                        <div className="relative aspect-video bg-[#1f1f23] rounded-lg overflow-hidden border border-white/10 group">
                          {thumbnail || streamKey ? (
                            <>
                              <img src={getPreviewThumbnail()} alt="Preview" className="w-full h-full object-cover" />
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

                      <div
                        className={`flex-1 border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all ${dragOver ? "border-purple-500 bg-purple-500/5" : "border-white/5 hover:border-white/20 hover:bg-white/5"}`}
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={(e) => {
                          e.preventDefault();
                          setDragOver(true);
                        }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={onDrop}
                      >
                        <div className="p-4 bg-purple-500/10 rounded-full">
                          <Upload className="w-8 h-8 text-purple-500" />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-bold">Chon anh tu may tinh</p>
                          <p className="text-xs text-white/30 mt-1">Hoac keo tha file vao day (Toi da 5MB)</p>
                        </div>
                        <input ref={fileInputRef} type="file" hidden accept="image/*" onChange={onFileChange} />
                      </div>
                    </div>

                    {thumbError && (
                      <p className="mt-4 text-xs text-red-500 font-medium flex items-center gap-2">
                        <X className="w-3 h-3" /> {thumbError}
                      </p>
                    )}
                  </div>

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
