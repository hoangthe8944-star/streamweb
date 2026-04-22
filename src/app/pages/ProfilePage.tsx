import { useParams, Link } from "react-router";
import { Settings, Share2, MoreVertical, Play } from "lucide-react";
import { useState } from "react";

const PROFILE_VIDEOS = [
  {
    id: 1,
    title: "Epic Gaming Moments - Highlight Reel",
    thumbnail: "https://picsum.photos/seed/vid1/400/225",
    views: "12K",
    date: "2 days ago",
    duration: "15:30",
  },
  {
    id: 2,
    title: "Best Plays of the Week",
    thumbnail: "https://picsum.photos/seed/vid2/400/225",
    views: "8.5K",
    date: "5 days ago",
    duration: "22:15",
  },
  {
    id: 3,
    title: "Tournament Finals Full Stream",
    thumbnail: "https://picsum.photos/seed/vid3/400/225",
    views: "25K",
    date: "1 week ago",
    duration: "3:45:20",
  },
  {
    id: 4,
    title: "Chill Gaming Session",
    thumbnail: "https://picsum.photos/seed/vid4/400/225",
    views: "6.2K",
    date: "2 weeks ago",
    duration: "1:12:45",
  },
];

const PROFILE_CLIPS = [
  {
    id: 1,
    title: "Insane clutch!",
    thumbnail: "https://picsum.photos/seed/clip1/300/169",
    views: "45K",
    date: "1 day ago",
    duration: "0:30",
  },
  {
    id: 2,
    title: "What just happened?!",
    thumbnail: "https://picsum.photos/seed/clip2/300/169",
    views: "32K",
    date: "3 days ago",
    duration: "0:45",
  },
  {
    id: 3,
    title: "Funny moment",
    thumbnail: "https://picsum.photos/seed/clip3/300/169",
    views: "18K",
    date: "5 days ago",
    duration: "1:05",
  },
  {
    id: 4,
    title: "Perfect shot",
    thumbnail: "https://picsum.photos/seed/clip4/300/169",
    views: "52K",
    date: "1 week ago",
    duration: "0:20",
  },
];

export function ProfilePage() {
  const { username } = useParams();
  const [activeTab, setActiveTab] = useState<"home" | "videos" | "clips" | "about">("home");
  const isOwnProfile = true; // Mock: In real app, check if viewing own profile

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Profile Banner */}
      <div className="relative h-64 bg-gradient-to-r from-purple-900 to-blue-900">
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Profile Header */}
      <div className="bg-[#18181b] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end gap-4 -mt-16 pb-4">
            <div className="w-32 h-32 rounded-full bg-purple-600 border-4 border-[#18181b] flex items-center justify-center text-4xl font-bold">
              {username?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 pb-2">
              <h1 className="text-3xl font-bold mb-1">{username}</h1>
              <div className="flex items-center gap-4 text-white/60">
                <span>156K followers</span>
                <span>•</span>
                <span>12.5K viewers</span>
              </div>
            </div>
            <div className="flex items-center gap-2 pb-2">
              {isOwnProfile ? (
                <Link
                  to="/settings"
                  className="px-4 py-2 bg-[#2c2c30] hover:bg-[#3a3a3d] rounded flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  Edit Profile
                </Link>
              ) : (
                <>
                  <button className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded font-semibold">
                    Follow
                  </button>
                  <button className="p-2 hover:bg-white/10 rounded">
                    <Share2 className="w-5 h-5" />
                  </button>
                </>
              )}
              <button className="p-2 hover:bg-white/10 rounded">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-6 text-sm">
            {["home", "videos", "clips", "about"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`py-3 border-b-2 ${
                  activeTab === tab
                    ? "border-purple-600 text-white"
                    : "border-transparent text-white/60 hover:text-white"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === "home" && (
          <div className="space-y-8">
            {/* Recent Videos */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Recent Videos</h2>
                <Link to="#" className="text-purple-400 hover:text-purple-300 text-sm">
                  View all
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {PROFILE_VIDEOS.slice(0, 4).map((video) => (
                  <div key={video.id} className="group cursor-pointer">
                    <div className="relative aspect-video rounded overflow-hidden mb-2">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/80 rounded text-xs">
                        {video.duration}
                      </div>
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Play className="w-12 h-12" />
                      </div>
                    </div>
                    <h3 className="font-medium mb-1 line-clamp-2 group-hover:text-purple-400">
                      {video.title}
                    </h3>
                    <p className="text-sm text-white/60">
                      {video.views} views • {video.date}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Popular Clips */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Popular Clips</h2>
                <Link to="#" className="text-purple-400 hover:text-purple-300 text-sm">
                  View all
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
                {PROFILE_CLIPS.map((clip) => (
                  <div key={clip.id} className="group cursor-pointer">
                    <div className="relative aspect-video rounded overflow-hidden mb-2">
                      <img
                        src={clip.thumbnail}
                        alt={clip.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute top-1.5 left-1.5 px-1 py-0.5 bg-black/80 rounded text-xs">
                        {clip.duration}
                      </div>
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Play className="w-8 h-8" />
                      </div>
                    </div>
                    <h3 className="text-sm font-medium mb-0.5 line-clamp-2 group-hover:text-purple-400">
                      {clip.title}
                    </h3>
                    <p className="text-xs text-white/60">{clip.views} views</p>
                  </div>
                ))}
              </div>
            </section>

            {/* About */}
            <section className="bg-[#1f1f23] rounded p-6">
              <h2 className="text-xl font-semibold mb-3">About</h2>
              <p className="text-white/80 mb-4">
                Professional gamer and content creator. Streaming daily at 6PM EST. Join the community!
              </p>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-white/60">Joined:</span> <span>January 2020</span>
                </div>
                <div>
                  <span className="text-white/60">Total Views:</span> <span>5.2M</span>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === "videos" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {PROFILE_VIDEOS.map((video) => (
              <div key={video.id} className="group cursor-pointer">
                <div className="relative aspect-video rounded overflow-hidden mb-2">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/80 rounded text-xs">
                    {video.duration}
                  </div>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Play className="w-12 h-12" />
                  </div>
                </div>
                <h3 className="font-medium mb-1 line-clamp-2 group-hover:text-purple-400">
                  {video.title}
                </h3>
                <p className="text-sm text-white/60">
                  {video.views} views • {video.date}
                </p>
              </div>
            ))}
          </div>
        )}

        {activeTab === "clips" && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {PROFILE_CLIPS.map((clip) => (
              <div key={clip.id} className="group cursor-pointer">
                <div className="relative aspect-video rounded overflow-hidden mb-2">
                  <img
                    src={clip.thumbnail}
                    alt={clip.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute top-1.5 left-1.5 px-1 py-0.5 bg-black/80 rounded text-xs">
                    {clip.duration}
                  </div>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Play className="w-8 h-8" />
                  </div>
                </div>
                <h3 className="text-sm font-medium mb-0.5 line-clamp-2 group-hover:text-purple-400">
                  {clip.title}
                </h3>
                <p className="text-xs text-white/60">
                  {clip.views} views • {clip.date}
                </p>
              </div>
            ))}
          </div>
        )}

        {activeTab === "about" && (
          <div className="max-w-3xl space-y-6">
            <div className="bg-[#1f1f23] rounded p-6">
              <h2 className="text-xl font-semibold mb-3">Description</h2>
              <p className="text-white/80 leading-relaxed">
                Professional gamer and content creator. Streaming daily at 6PM EST. Join the community
                and let's have some fun together!
              </p>
            </div>

            <div className="bg-[#1f1f23] rounded p-6">
              <h2 className="text-xl font-semibold mb-4">Panel</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="aspect-square bg-[#2c2c30] rounded flex items-center justify-center text-white/40"
                  >
                    Panel {i}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#1f1f23] rounded p-6">
              <h2 className="text-xl font-semibold mb-3">Stats</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-2xl font-bold">156K</div>
                  <div className="text-sm text-white/60">Followers</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">5.2M</div>
                  <div className="text-sm text-white/60">Total Views</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">342</div>
                  <div className="text-sm text-white/60">Videos</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">1.2K</div>
                  <div className="text-sm text-white/60">Clips</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
