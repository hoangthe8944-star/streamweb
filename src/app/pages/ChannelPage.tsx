import { useLocation, useParams } from "react-router";
import { useEffect, useState } from "react";
import {
  AlertTriangle,
  Bell,
  Flag,
  Gem,
  HandCoins,
  Heart,
  HeartOff,
  Loader2,
  MoreVertical,
  Share2,
  Users,
  X,
} from "lucide-react";
import streamApi, { Stream } from "../../../api/streamApi";
import followApi from "../../../api/followApi";
import reportApi from "../../../api/reportApi";
import donationApi, { DonationDto } from "../../../api/donationApi";
import { VideoPlayer } from "../components/VideoPlayer";
import { ChatPanel } from "../components/ChatPanel";
import { getStreamThumbnail } from "../utils/streamThumbnail";

const QUICK_DONATION_AMOUNTS = [10000, 20000, 50000, 100000, 200000];

const getApiErrorMessage = (err: any, fallback: string) => {
  const data = err?.response?.data;

  if (data?.message) {
    return data.message;
  }

  if (data?.errors && typeof data.errors === "object") {
    const firstErrorGroup = Object.values(data.errors).find(
      (value): value is string[] => Array.isArray(value) && value.length > 0
    );

    if (firstErrorGroup?.[0]) {
      return firstErrorGroup[0];
    }
  }

  return fallback;
};

export function ChannelPage() {
  const { channelName } = useParams<{ channelName: string }>();
  const location = useLocation();

  const [stream, setStream] = useState<Stream | null>(location.state?.streamData || null);
  const [viewersCount, setViewersCount] = useState(location.state?.streamData?.viewersCount || 0);
  const [loading, setLoading] = useState(!location.state?.streamData);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [donationAmount, setDonationAmount] = useState<number>(50000);
  const [donationMessage, setDonationMessage] = useState("");
  const [donationMethod, setDonationMethod] = useState("direct");
  const [isSubmittingDonation, setIsSubmittingDonation] = useState(false);
  const [donationTotal, setDonationTotal] = useState(0);
  const [recentDonations, setRecentDonations] = useState<DonationDto[]>([]);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      setCurrentUserId(user.userId ?? user.id ?? null);
    }

    const fetchChannelData = async () => {
      try {
        const res = await streamApi.getLiveStreams();
        const foundStream = res.data.find(
          (s) => s.streamerName?.toLowerCase().replace(/\s+/g, "") === channelName
        );

        if (foundStream) {
          setStream(foundStream);
          setViewersCount(foundStream.viewersCount);

          if (localStorage.getItem("token")) {
            const statusRes = await followApi.isFollowing(foundStream.streamerId);
            setIsFollowing(statusRes.data);
          }
        }
      } catch (err) {
        console.error("Loi API:", err);
      } finally {
        setLoading(false);
      }
    };

    if (channelName) {
      fetchChannelData();
    }
  }, [channelName, stream]);

  useEffect(() => {
    const fetchDonationData = async () => {
      if (!stream) return;

      try {
        const [totalRes, donationsRes] = await Promise.all([
          donationApi.getTotalDonation(stream.streamerId),
          donationApi.getDonationsByStream(stream.id),
        ]);

        setDonationTotal(Number(totalRes.data) || 0);
        setRecentDonations(donationsRes.data.slice(0, 6));
      } catch (err) {
        console.error("Loi khi tai du lieu donate:", err);
      }
    };

    fetchDonationData();
  }, [stream?.id, stream?.streamerId]);

  const handleFollowToggle = async () => {
    if (!stream) return;
    if (!localStorage.getItem("token")) {
      alert("Vui long dang nhap!");
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
      const errorMsg = err.response?.data?.message || "Thao tac that bai";
      alert(errorMsg);
    } finally {
      setFollowLoading(false);
    }
  };

  const handleDonate = async () => {
    if (!stream) return;
    if (!localStorage.getItem("token")) {
      alert("Vui long dang nhap de donate.");
      return;
    }
    if (donationAmount <= 0) {
      alert("So tien donate phai lon hon 0.");
      return;
    }
    try {
      setIsSubmittingDonation(true);

      const res = await donationApi.donate({
        streamerId: stream.streamerId,
        streamId: stream.id,
        amount: donationAmount,
        message: donationMessage.trim() || undefined,
        paymentMethod: donationMethod,
      });

      const newDonation = res.data;
      setDonationTotal((prev) => prev + newDonation.amount);
      setRecentDonations((prev) => [newDonation, ...prev].slice(0, 6));
      setDonationAmount(50000);
      setDonationMessage("");
      setDonationMethod("direct");
      setShowDonateModal(false);
      alert("Donate thanh cong. Cam on ban da ung ho streamer!");
    } catch (err: any) {
      console.error("Loi donate:", err);
      const errorMsg = getApiErrorMessage(
        err,
        "Khong the thuc hien donate luc nay."
      );
      alert(errorMsg);
    } finally {
      setIsSubmittingDonation(false);
    }
  };

  const handleSendReport = async () => {
    if (!reportReason.trim() || !stream) return;

    const userStr = localStorage.getItem("user");
    const currentUser = userStr ? JSON.parse(userStr) : null;
    const reporterId = currentUser?.userId ?? currentUser?.id;

    if (!reporterId) {
      alert("Vui long dang nhap de thuc hien bao cao.");
      return;
    }

    try {
      setIsSubmittingReport(true);
      await reportApi.create({
        reporterId,
        streamId: stream.id,
        reportedUserId: stream.streamerId,
        reason: reportReason,
      });

      alert("Bao cao cua ban da duoc gui di. Cam on ban!");
      setShowReportModal(false);
      setReportReason("");
    } catch (err: any) {
      console.error("Loi bao cao:", err);
      const msg = getApiErrorMessage(
        err,
        "Khong the gui bao cao vao luc nay."
      );
      alert(msg);
    } finally {
      setIsSubmittingReport(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0e0e10] text-white">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (!stream) {
    return <div className="flex items-center justify-center h-screen bg-[#0e0e10] text-white">Kenh khong ton tai</div>;
  }

  const isMyOwnChannel = currentUserId === stream.streamerId;

  return (
    <div className="flex flex-col lg:flex-row h-full bg-[#0e0e10] text-white overflow-hidden relative">
      <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar">
        <VideoPlayer
          streamKey={stream.streamKey || ""}
          thumbnail={getStreamThumbnail(stream)}
          viewers={viewersCount}
          isLive={stream.isLive ?? stream.status === "live"}
        />

        <div className="p-4 md:p-5 space-y-4">
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

            <div className="flex gap-2 ml-4">
              <button className="p-2 hover:bg-white/10 rounded-md transition-colors">
                <Share2 className="w-5 h-5" />
              </button>

              {!isMyOwnChannel && (
                <button
                  onClick={() => setShowReportModal(true)}
                  className="p-2 hover:bg-red-500/20 rounded-md transition-colors text-white/40 hover:text-red-500"
                  title="Bao cao vi pham"
                >
                  <Flag className="w-5 h-5" />
                </button>
              )}

              <button className="p-2 hover:bg-white/10 rounded-md transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 py-3 border-t border-white/5">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-600 rounded-full" />
            <div className="flex-1">
              <h2 className="font-bold text-base md:text-lg">{stream.streamerName}</h2>
              <p className="text-xs text-white/50">Cong dong cua {stream.streamerName}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-2.5 py-1 text-emerald-300">
                  <Gem className="h-3.5 w-3.5" />
                  Tong donate {donationTotal.toLocaleString()} VND
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-white/60">
                  {recentDonations.length} ung ho gan day
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start md:self-center">
              {!isMyOwnChannel && (
                <button
                  onClick={() => setShowDonateModal(true)}
                  className="px-3 py-2 rounded-lg text-sm font-bold flex items-center gap-2 bg-emerald-500 text-black hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20"
                >
                  <HandCoins className="w-4 h-4" /> Donate
                </button>
              )}
              {!isMyOwnChannel && (
                <button
                  onClick={handleFollowToggle}
                  disabled={followLoading}
                  className={`px-3 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${isFollowing ? "bg-[#2c2c30] text-white" : "bg-purple-600 text-white"}`}
                >
                  {followLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : isFollowing ? (
                    <>
                      <HeartOff className="w-4 h-4" /> Bo theo doi
                    </>
                  ) : (
                    <>
                      <Heart className="w-4 h-4" /> Theo doi
                    </>
                  )}
                </button>
              )}
              <button className="p-2 bg-[#2c2c30] rounded-lg">
                <Bell className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-white/5 bg-[#18181b] p-3 md:p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wide text-white/90">Recent Donations</h3>
                <p className="text-xs text-white/45">Nhung luot ung ho moi nhat danh cho kenh nay</p>
              </div>
              <div className="rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-emerald-300">
                {donationTotal.toLocaleString()} VND
              </div>
            </div>

            {recentDonations.length > 0 ? (
              <div className="space-y-2.5">
                {recentDonations.map((donation) => (
                  <div
                    key={donation.id}
                    className="flex items-start justify-between gap-3 rounded-xl border border-white/5 bg-white/[0.03] px-3 py-2.5"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white">
                        {donation.username}
                        <span className="ml-2 text-emerald-300">{donation.amount.toLocaleString()} VND</span>
                      </p>
                      <p className="mt-1 text-xs md:text-sm text-white/60">{donation.message || "Da gui mot luot ung ho den streamer."}</p>
                    </div>
                    <span className="shrink-0 text-xs text-white/35">
                      {new Date(donation.createdAt).toLocaleString("vi-VN")}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.02] p-4 text-center text-sm text-white/45">
                Chua co donation nao. Hay tro thanh nguoi ung ho dau tien!
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="w-full lg:w-[340px] border-l border-white/5 bg-[#0e0e10]">
        <ChatPanel channelName={stream.streamerName} streamId={stream.id} />
      </div>

      {showReportModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#18181b] border border-white/10 w-full max-w-md rounded-xl shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-red-500">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="font-bold uppercase tracking-tight">Bao cao vi pham</h3>
              </div>
              <button onClick={() => setShowReportModal(false)} className="p-1 hover:bg-white/10 rounded-full transition-colors text-white/40 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <p className="text-sm text-white/60 mb-4">
                Ban dang bao cao noi dung cua <span className="text-white font-bold">{stream.streamerName}</span>.
                Vui long nhap ly do chi tiet:
              </p>

              <textarea
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                placeholder="Vi du: Noi dung phan cam, ngon tu thu ghet, lua dao..."
                className="w-full h-32 bg-[#0e0e10] border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-red-500/50 resize-none transition-all"
              />

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowReportModal(false)}
                  className="flex-1 py-2.5 bg-[#2c2c30] hover:bg-[#3a3a3d] rounded-lg font-bold transition-colors"
                >
                  Huy
                </button>
                <button
                  onClick={handleSendReport}
                  disabled={!reportReason.trim() || isSubmittingReport}
                  className="flex-[2] py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-bold transition-all flex items-center justify-center gap-2"
                >
                  {isSubmittingReport && <Loader2 className="w-4 h-4 animate-spin" />}
                  GUI BAO CAO
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDonateModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#18181b] border border-white/10 w-full max-w-lg max-h-[88vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-300">
                  <HandCoins className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base md:text-lg">Ung ho streamer</h3>
                  <p className="text-xs md:text-sm text-white/45">Gui mot donation den {stream.streamerName}</p>
                </div>
              </div>
              <button onClick={() => setShowDonateModal(false)} className="p-1 hover:bg-white/10 rounded-full transition-colors text-white/40 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-4 overflow-y-auto">
              <div>
                <label className="mb-2 block text-sm font-semibold text-white/80">Chon nhanh so tien</label>
                <div className="grid grid-cols-3 gap-2">
                  {QUICK_DONATION_AMOUNTS.map((amount) => {
                    const active = donationAmount === amount;
                    return (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => setDonationAmount(amount)}
                        className={`rounded-xl border px-3 py-2.5 text-sm font-bold transition-all ${
                          active
                            ? "border-emerald-400 bg-emerald-500/15 text-emerald-300"
                            : "border-white/10 bg-white/[0.03] text-white/75 hover:border-white/20 hover:bg-white/[0.05]"
                        }`}
                      >
                        {amount.toLocaleString()} VND
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-white/80">So tien tuy chinh</label>
                <input
                  type="number"
                  min={1}
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(Number(e.target.value) || 0)}
                  className="w-full rounded-xl border border-white/10 bg-[#0e0e10] px-4 py-2.5 text-white outline-none transition-all focus:border-emerald-400/50"
                  placeholder="Nhap so tien ban muon donate"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-white/80">Loi nhan</label>
                <textarea
                  value={donationMessage}
                  onChange={(e) => setDonationMessage(e.target.value)}
                  maxLength={255}
                  placeholder="Gui loi dong vien den streamer..."
                  className="w-full h-24 md:h-26 rounded-xl border border-white/10 bg-[#0e0e10] px-4 py-3 text-white outline-none resize-none transition-all focus:border-emerald-400/50"
                />
                <div className="mt-1 text-right text-xs text-white/35">{donationMessage.length}/255</div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-white/80">Phuong thuc</label>
                <div className="flex gap-2">
                  {["direct", "wallet"].map((method) => {
                    const active = donationMethod === method;
                    return (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setDonationMethod(method)}
                        className={`rounded-full px-3 py-1.5 text-sm font-semibold transition-all ${
                          active
                            ? "bg-emerald-500 text-black"
                            : "bg-white/[0.04] text-white/65 hover:bg-white/[0.08]"
                        }`}
                      >
                        {method === "direct" ? "Direct" : "Wallet"}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-xl border border-emerald-500/15 bg-emerald-500/5 p-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/55">Tong donate hien tai</span>
                  <span className="font-bold text-emerald-300">{donationTotal.toLocaleString()} VND</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-base">
                  <span className="font-semibold text-white">Ban sap gui</span>
                  <span className="text-lg md:text-xl font-black text-white">{donationAmount.toLocaleString()} VND</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDonateModal(false)}
                  className="flex-1 rounded-xl bg-white/[0.06] py-2.5 font-bold text-white transition-colors hover:bg-white/[0.1]"
                >
                  Huy
                </button>
                <button
                  onClick={handleDonate}
                  disabled={isSubmittingDonation || donationAmount <= 0}
                  className="flex-[1.4] rounded-xl bg-emerald-500 py-2.5 font-black text-black transition-all hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmittingDonation && <Loader2 className="w-4 h-4 animate-spin" />}
                  DONATE NGAY
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
