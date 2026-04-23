import { useState, useEffect } from 'react';
import { Loader2, Users } from "lucide-react";
import { StreamCard } from "../components/StreamCard";
import followApi, { FollowDto } from "../../../api/followApi";
import streamApi, { Stream } from "../../../api/streamApi";

export function FollowingPage() {
  const [liveFollowing, setLiveFollowing] = useState<Stream[]>([]);
  const [offlineFollowing, setOfflineFollowing] = useState<FollowDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 1. Lấy danh sách những người mình đang follow
        const followRes = await followApi.getFollowing();
        const followingList = followRes.data;

        // 2. Lấy danh sách tất cả các luồng đang Live trên hệ thống
        const streamRes = await streamApi.getLiveStreams();
        const allLiveStreams = streamRes.data;

        // 3. Lọc ra những người mình follow mà đang Live
        const live = allLiveStreams.filter(stream => 
          followingList.some(f => f.followingId === stream.streamerId)
        );

        // 4. Lọc ra những người mình follow mà đang Offline
        const offline = followingList.filter(f => 
          !allLiveStreams.some(stream => stream.streamerId === f.followingId)
        );

        setLiveFollowing(live);
        setOfflineFollowing(offline);
      } catch (err) {
        console.error("Lỗi khi tải danh sách Following:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <div className="p-6 custom-scrollbar overflow-y-auto h-full">
      {/* SECTION: LIVE CHANNELS */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          Live Channels 
          <span className="bg-red-600 text-[10px] px-2 py-0.5 rounded-full animate-pulse">
            {liveFollowing.length}
          </span>
        </h2>
        
        {liveFollowing.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {liveFollowing.map((stream) => (
              <StreamCard 
                key={stream.id}
                channelName={stream.streamerName}
                title={stream.title}
                game={stream.categoryName || "Chưa phân loại"}
                viewers={stream.viewersCount}
                thumbnail={stream.thumbnail || "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800"}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white/5 border border-white/5 rounded-xl p-8 text-center text-white/40">
            Không có kênh nào bạn theo dõi đang phát trực tiếp.
          </div>
        )}
      </section>

      {/* SECTION: OFFLINE CHANNELS */}
      <section>
        <h2 className="text-xl font-bold mb-4 text-white/70">Offline Channels</h2>
        
        {offlineFollowing.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {offlineFollowing.map((follow) => (
              <div
                key={follow.id}
                className="flex items-center gap-3 p-3 bg-[#18181b] border border-transparent hover:border-purple-500/30 rounded-lg hover:bg-[#1f1f23] transition-all cursor-pointer group"
              >
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex-shrink-0 border-2 border-transparent group-hover:border-purple-500 transition-all" />
                  <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white/20">
                    OFF
                  </div>
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold truncate text-white/90">{follow.followingUsername}</h3>
                  <p className="text-xs text-white/40 italic">Offline</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-white/20">Bạn chưa theo dõi ai cả.</p>
        )}
      </section>
    </div>
  );
}