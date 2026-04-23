import { useLocation, useParams } from "react-router";
import { useState, useEffect } from 'react';
import { Heart, Bell, Share2, MoreVertical, Loader2, Users, HeartOff, Flag, X, AlertTriangle } from "lucide-react"; // Thêm icon Flag, X, Alert
import streamApi, { Stream } from "../../../api/streamApi";
import followApi from "../../../api/followApi";
import reportApi from "../../../api/reportApi"; // Import reportApi
import { VideoPlayer } from "../components/VideoPlayer";
import { ChatPanel } from '../components/ChatPanel';

export function ChannelPage() {
  const { channelName } = useParams<{ channelName: string }>();
  const location = useLocation();

  const [stream, setStream] = useState<Stream | null>(location.state?.streamData || null);
  const [viewersCount, setViewersCount] = useState(location.state?.streamData?.viewersCount || 0);
  const [loading, setLoading] = useState(!location.state?.streamData);

  // Logic Follow
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  // --- Logic Report (Thêm mới) ---
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      setCurrentUserId(user.userId);
    }

    const fetchChannelData = async () => {
      try {
        const res = await streamApi.getLiveStreams();
        const foundStream = res.data.find(
          (s) => s.streamerName?.toLowerCase().replace(/\s+/g, "") === channelName
        );

        if (foundStream) {
          if (!stream) setStream(foundStream);
          setViewersCount(foundStream.viewersCount);

          const token = localStorage.getItem("token");
          if (token) {
            const statusRes = await followApi.isFollowing(foundStream.streamerId);
            setIsFollowing(statusRes.data);
          }
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
  }, [channelName, stream]);

  const handleFollowToggle = async () => {
    if (!stream) return;
    if (!localStorage.getItem("token")) {
      alert("Vui lòng đăng nhập!");
      return;
    }

    try {
      setFollowLoading(true);
      if (isFollowing) {
        await followApi.unfollow(stream.streamerId);
        setIsFollowing(false);
      } else {
        await followApi.follow(stream.streamerId);
        setIsFollowing(true);
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Thao tác thất bại";
      alert(errorMsg);
    } finally {
      setFollowLoading(false);
    }
  };

  // --- Hàm gửi báo cáo (Thêm mới) ---
  const handleSendReport = async () => {
    if (!reportReason.trim() || !stream) return;

    // Đọc trực tiếp từ localStorage để đảm bảo luôn có dữ liệu mới nhất
    const userStr = localStorage.getItem("user");
    const currentUser = userStr ? JSON.parse(userStr) : null;

    // Kiểm tra nếu không có user hoặc không có id trong user
    if (!currentUser || !currentUser.userId) {
      alert("Vui lòng đăng nhập để thực hiện báo cáo.");
      return;
    }

    try {
      setIsSubmittingReport(true);
      await reportApi.create({
        reporterId: currentUser.userId, // Lấy ID trực tiếp từ object vừa parse
        streamId: stream.id,
        reportedUserId: stream.streamerId,
        reason: reportReason
      });

      alert("Báo cáo của bạn đã được gửi đi. Cảm ơn bạn!");
      setShowReportModal(false);
      setReportReason("");
    } catch (err: any) {
      console.error("Lỗi báo cáo:", err);
      const msg = err.response?.data?.message || "Không thể gửi báo cáo vào lúc này.";
      alert(msg);
    } finally {
      setIsSubmittingReport(false);
    }
  };
  if (loading) return <div className="flex items-center justify-center h-screen bg-[#0e0e10] text-white"><Loader2 className="animate-spin" /></div>;
  if (!stream) return <div className="flex items-center justify-center h-screen bg-[#0e0e10] text-white">Kênh không tồn tại</div>;

  const isMyOwnChannel = currentUserId === stream.streamerId;

  return (
    <div className="flex flex-col lg:flex-row h-full bg-[#0e0e10] text-white overflow-hidden relative">
      <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar">
        <VideoPlayer streamKey={stream.streamKey || ""} thumbnail={stream.thumbnail} viewers={viewersCount} isLive={stream.isLive} />

        <div className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="min-w-0 flex-1">
              <h1 className="text-xl font-bold mb-2">{stream.title}</h1>
              <div className="flex items-center gap-3 text-sm">
                <span className="text-purple-400 font-bold">{stream.categoryName}</span>
                <div className="flex items-center gap-1.5 text-white/60">
                  <Users className="w-4 h-4" />
                  <span>{viewersCount.toLocaleString()} viewers</span>
                </div>
              </div>
            </div>
            {/* Nút thao tác thêm: Share, Report, More */}
            <div className="flex gap-2 ml-4">
              <button className="p-2 hover:bg-white/10 rounded-md transition-colors"><Share2 className="w-5 h-5" /></button>

              {/* NÚT BÁO CÁO (Thêm mới) */}
              {!isMyOwnChannel && (
                <button
                  onClick={() => setShowReportModal(true)}
                  className="p-2 hover:bg-red-500/20 rounded-md transition-colors text-white/40 hover:text-red-500"
                  title="Báo cáo vi phạm"
                >
                  <Flag className="w-5 h-5" />
                </button>
              )}

              <button className="p-2 hover:bg-white/10 rounded-md transition-colors"><MoreVertical className="w-5 h-5" /></button>
            </div>
          </div>

          <div className="flex items-center gap-4 py-4 border-t border-white/5">
            <div className="w-12 h-12 bg-purple-600 rounded-full" />
            <div className="flex-1">
              <h2 className="font-bold text-lg">{stream.streamerName}</h2>
              <p className="text-xs text-white/50">Cộng đồng của {stream.streamerName}</p>
            </div>

            <div className="flex items-center gap-2">
              {!isMyOwnChannel && (
                <button
                  onClick={handleFollowToggle}
                  disabled={followLoading}
                  className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all ${isFollowing ? "bg-[#2c2c30] text-white" : "bg-purple-600 text-white"
                    }`}
                >
                  {followLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : isFollowing ? <><HeartOff className="w-4 h-4" /> Bỏ theo dõi</> : <><Heart className="w-4 h-4" /> Theo dõi</>}
                </button>
              )}
              <button className="p-2.5 bg-[#2c2c30] rounded-lg"><Bell className="w-5 h-5" /></button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-[340px] border-l border-white/5 bg-[#0e0e10]">
        <ChatPanel channelName={stream.streamerName} streamId={stream.id} />
      </div>

      {/* --- MODAL BÁO CÁO (Thêm mới) --- */}
      {showReportModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#18181b] border border-white/10 w-full max-w-md rounded-xl shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-red-500">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="font-bold uppercase tracking-tight">Báo cáo vi phạm</h3>
              </div>
              <button onClick={() => setShowReportModal(false)} className="p-1 hover:bg-white/10 rounded-full transition-colors text-white/40 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <p className="text-sm text-white/60 mb-4">
                Bạn đang báo cáo nội dung của <span className="text-white font-bold">{stream.streamerName}</span>.
                Vui lòng chọn hoặc nhập lý do chi tiết:
              </p>

              <textarea
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                placeholder="Ví dụ: Nội dung phản cảm, ngôn từ thù ghét, lừa đảo..."
                className="w-full h-32 bg-[#0e0e10] border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-red-500/50 resize-none transition-all"
              />

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowReportModal(false)}
                  className="flex-1 py-2.5 bg-[#2c2c30] hover:bg-[#3a3a3d] rounded-lg font-bold transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSendReport}
                  disabled={!reportReason.trim() || isSubmittingReport}
                  className="flex-[2] py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-bold transition-all flex items-center justify-center gap-2"
                >
                  {isSubmittingReport && <Loader2 className="w-4 h-4 animate-spin" />}
                  GỬI BÁO CÁO
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}