import { StreamCard } from "../components/StreamCard";

const FOLLOWING_STREAMS = [
  {
    channelName: "ProGamer123",
    title: "Speedrunning World Record Attempt!",
    game: "Super Mario 64",
    viewers: 12340,
    thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=450&fit=crop",
  },
  {
    channelName: "CoolStreamer",
    title: "Late Night Chill Stream",
    game: "Minecraft",
    viewers: 8920,
    thumbnail: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&h=450&fit=crop",
  },
  {
    channelName: "GameMaster",
    title: "New Game Release Playthrough",
    game: "Elden Ring",
    viewers: 23410,
    thumbnail: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=450&fit=crop",
  },
  {
    channelName: "TechChannel",
    title: "Building a PC Live!",
    game: "Just Chatting",
    viewers: 5670,
    thumbnail: "https://images.unsplash.com/photo-1587202372616-b43abea06c2a?w=800&h=450&fit=crop",
  },
];

const OFFLINE_CHANNELS = [
  { name: "MusicLive", lastSeen: "2 hours ago" },
  { name: "ArtStudio", lastSeen: "5 hours ago" },
];

export function FollowingPage() {
  return (
    <div className="p-6">
      <section className="mb-8">
        <h2 className="text-xl mb-4">Live Channels ({FOLLOWING_STREAMS.length})</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {FOLLOWING_STREAMS.map((stream) => (
            <StreamCard key={stream.channelName} {...stream} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl mb-4">Offline Channels</h2>
        <div className="space-y-2">
          {OFFLINE_CHANNELS.map((channel) => (
            <div
              key={channel.name}
              className="flex items-center gap-3 p-3 bg-white/5 rounded hover:bg-white/10 cursor-pointer"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full" />
              <div>
                <h3 className="font-semibold">{channel.name}</h3>
                <p className="text-sm text-white/60">Last seen {channel.lastSeen}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
