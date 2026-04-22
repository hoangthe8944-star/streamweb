import { useLocation, useParams } from "react-router"; // Khuyên dùng react-router-dom
import { useState, useEffect } from 'react';
import { Heart, Bell, Share2, MoreVertical, Loader2, Users } from "lucide-react";
import streamApi, { Stream } from "../../../api/streamApi"; // Đảm bảo import cả default và interface
import { VideoPlayer } from "../components/VideoPlayer";
import { ChatPanel } from '../components/ChatPanel';

export function ChannelPage() {
  const { channelName } = useParams<{ channelName: string }>();
  const location = useLocation();

  // Khởi tạo stream từ state nếu có, giúp trang hiện hình ngay lập tức không cần chờ xoay vòng
  const [stream, setStream] = useState<Stream | null>(location.state?.streamData || null);
  const [loading, setLoading] = useState(!location.state?.streamData); 
  

  useEffect(() => {
    const fetchChannelData = async () => {
      try {
        // Nếu đã có dữ liệu từ state rồi thì không cần hiện loading xoay nữa, nhưng vẫn fetch ngầm để cập nhật viewers mới nhất
        if (!stream) setLoading(true); 

        console.log("Đang đồng bộ dữ liệu cho channel:", channelName);

        const res = await streamApi.getLiveStreams();
        const foundStream = res.data.find(
          (s) => s.streamerName?.toLowerCase().replace(/\s+/g, "") === channelName
        );

        if (foundStream) {
          setStream(foundStream);
        } else {
          // Chỉ giả lập khi thực sự không tìm thấy trong danh sách live
          console.warn("Không tìm thấy stream live, đang dùng dữ liệu giả.");
          setStream({
            id: 0,
            title: "Live Stream Test (Dữ liệu giả lập)",
            streamerName: channelName || "Streamer",
            categoryName: "Gaming",
            viewersCount: 1234,
            thumbnail: "https://picsum.photos/seed/live/1280/720",
            isLive: true,
            streamKey: "8b26c438a0e14433839edb80ebde2642"
          } as Stream);
        }
      } catch (err) {
        console.error("Lỗi API:", err);
      } finally {
        setLoading(false);
      }
    };

    if (channelName) {
      fetchChannelData();
    }
  }, [channelName, stream]); // Thêm stream vào dependency nếu muốn cập nhật ngầm

  if (loading) return (
    <div className="flex-1 flex items-center justify-center bg-[#0e0e10] h-full text-white">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
        <p className="text-sm text-white/40">Đang nạp luồng dữ liệu...</p>
      </div>
    </div>
  );

  if (!stream) return (
    <div className="flex-1 flex items-center justify-center bg-[#0e0e10] text-white">
      <p>Kênh không tồn tại hoặc đã tắt Live.</p>
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row h-full bg-[#0e0e10] text-white overflow-hidden">
      <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar">
        {/* Truyền streamKey vào Player để hls.js hoạt động */}
        <VideoPlayer
          streamKey={stream.streamKey || ""}
          thumbnail={stream.thumbnail}
          viewers={stream.viewersCount}
          isLive={stream.isLive}
        />

        <div className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="min-w-0 flex-1">
              <h1 className="text-xl font-bold mb-2 truncate">{stream.title}</h1>
              <div className="flex items-center gap-3 text-sm">
                <span className="text-purple-400 font-bold hover:underline cursor-pointer">{stream.categoryName}</span>
                <span className="text-white/20">|</span>
                <div className="flex items-center gap-1.5 text-white/60">
                   <Users className="w-4 h-4" />
                   <span>{stream.viewersCount.toLocaleString()} viewers</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2 ml-4">
              <button className="p-2 hover:bg-white/10 rounded-md transition-colors"><Share2 className="w-5 h-5" /></button>
              <button className="p-2 hover:bg-white/10 rounded-md transition-colors"><MoreVertical className="w-5 h-5" /></button>
            </div>
          </div>

          {/* Streamer Info */}
          <div className="flex items-center gap-4 py-4 border-t border-white/5">
            <div className="w-12 h-12 bg-gradient-to-tr from-purple-600 to-pink-500 rounded-full flex-shrink-0 ring-2 ring-purple-500 ring-offset-2 ring-offset-[#0e0e10]" />
            <div className="flex-1 min-w-0">
              <h2 className="font-bold text-lg">{stream.streamerName}</h2>
              <p className="text-xs text-white/50 uppercase tracking-wider">Cộng đồng của {stream.streamerName}</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-bold flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-purple-500/20">
                <Heart className="w-4 h-4 fill-white" /> Theo dõi
              </button>
              <button className="p-2.5 bg-[#2c2c30] hover:bg-[#3a3a3d] rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-[340px] border-l border-white/5 bg-[#0e0e10] flex-shrink-0">
        <ChatPanel channelName={stream.streamerName} />
      </div>
    </div>
  );
}