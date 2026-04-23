import { Link, useLocation } from "react-router";
import { Home, Compass, Heart, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import followApi from "../../../api/followApi";
import streamApi from "../../../api/streamApi";

interface FollowedChannel {
  name: string;
  viewers: number;
  isLive: boolean;
  avatar?: string;
}

export function Sidebar() {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(true);
  const [followedChannels, setFollowedChannels] = useState<FollowedChannel[]>([]);
  const [loading, setLoading] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const fetchFollowedData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        setLoading(true);
        const [followRes, streamRes] = await Promise.all([
          followApi.getFollowing(),
          streamApi.getLiveStreams()
        ]);

        const followingList = followRes.data;
        const allLiveStreams = streamRes.data;

        const merged = followingList.map((f: any) => {
          // LƯU Ý: Backend trả về "username" hoặc "Username", không phải "followingUsername"
          const name = f.username || f.Username || f.followingUsername || "Unknown";
          const liveData = allLiveStreams.find(s => s.streamerId === f.followingId || s.streamerId === f.FollowingId);
          
          return {
            name: name,
            avatar: f.avatar || f.Avatar,
            isLive: !!liveData,
            viewers: liveData?.viewersCount || 0
          };
        });

        merged.sort((a, b) => (a.isLive === b.isLive ? 0 : a.isLive ? -1 : 1));
        setFollowedChannels(merged);
      } catch (err) {
        console.error("Sidebar API Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowedData();
    const interval = setInterval(fetchFollowedData, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <aside className="w-60 bg-[#0e0e10] border-r border-white/10 flex flex-col h-full overflow-hidden">
      <div className="p-3 space-y-1">
        <Link to="/" className={`flex items-center gap-3 px-3 py-2 rounded hover:bg-white/10 ${isActive('/') ? 'bg-white/10' : ''}`}>
          <Home className="w-5 h-5" /> <span>Home</span>
        </Link>
        <Link to="/following" className={`flex items-center gap-3 px-3 py-2 rounded hover:bg-white/10 ${isActive('/following') ? 'bg-white/10' : ''}`}>
          <Heart className="w-5 h-5" /> <span>Following</span>
        </Link>
        <Link to="/browse" className={`flex items-center gap-3 px-3 py-2 rounded hover:bg-white/10 ${isActive('/browse') ? 'bg-white/10' : ''}`}>
          <Compass className="w-5 h-5" /> <span>Browse</span>
        </Link>
      </div>

      <div className="flex-1 flex flex-col min-h-0 border-t border-white/10 mt-2">
        <button onClick={() => setIsExpanded(!isExpanded)} className="w-full flex items-center justify-between px-3 py-3 hover:bg-white/5">
          <span className="text-[11px] text-white/50 uppercase font-bold">Followed Channels</span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {isExpanded && (
          <div className="flex-1 overflow-y-auto custom-scrollbar px-2">
            {loading && followedChannels.length === 0 ? (
              <div className="flex justify-center py-4"><Loader2 className="w-5 h-5 animate-spin text-white/20" /></div>
            ) : (
              followedChannels.map((channel) => (
                <Link
                  key={channel.name}
                  // THÊM KIỂM TRA: channel.name ? ... : "#" để tránh lỗi toLowerCase
                  to={channel.name ? `/channel/${channel.name.toLowerCase().replace(/\s+/g, "")}` : "#"}
                  className="flex items-center gap-3 px-2 py-2 rounded hover:bg-white/10 group"
                >
                  <div className="relative shrink-0">
                    <div className="w-8 h-8 bg-[#2f2f35] rounded-full overflow-hidden border border-white/5">
                       {channel.avatar ? <img src={channel.avatar} className="w-full h-full object-cover" /> : null}
                    </div>
                    {channel.isLive && <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 border-2 border-[#0e0e10] rounded-full" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-sm truncate font-medium text-white/90">{channel.name}</span>
                      {channel.isLive && <span className="text-[10px] text-red-500 font-bold animate-pulse">LIVE</span>}
                    </div>
                    <div className="text-[11px] text-white/40 truncate">
                      {channel.isLive ? `${channel.viewers.toLocaleString()} viewers` : "Offline"}
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}
      </div>
    </aside>
  );
}