import { Link, useLocation } from "react-router";
import { Home, Compass, Heart, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

const FOLLOWED_CHANNELS = [
  { name: "ProGamer123", viewers: 1234, isLive: true },
  { name: "CoolStreamer", viewers: 892, isLive: true },
  { name: "GameMaster", viewers: 2341, isLive: true },
  { name: "TechChannel", viewers: 567, isLive: true },
  { name: "MusicLive", viewers: 0, isLive: false },
  { name: "ArtStudio", viewers: 0, isLive: false },
];

export function Sidebar() {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(true);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const NavLink = ({ to, icon: Icon, children }: any) => (
    <Link
      to={to}
      className={`flex items-center gap-3 px-3 py-2 rounded hover:bg-white/10 ${
        isActive(to) ? "bg-white/10" : ""
      }`}
    >
      <Icon className="w-5 h-5" />
      <span>{children}</span>
    </Link>
  );

  return (
    <aside className="w-60 bg-[#0e0e10] border-r border-white/10 flex flex-col overflow-y-auto">
      <div className="p-3 space-y-1">
        <NavLink to="/" icon={Home}>
          Home
        </NavLink>
        <NavLink to="/following" icon={Heart}>
          Following
        </NavLink>
        <NavLink to="/browse" icon={Compass}>
          Browse
        </NavLink>
      </div>

      <div className="border-t border-white/10 mt-2">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between px-3 py-2 hover:bg-white/10"
        >
          <span className="text-sm text-white/60 uppercase tracking-wide">
            Followed Channels
          </span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>

        {isExpanded && (
          <div className="px-1">
            {FOLLOWED_CHANNELS.map((channel) => (
              <Link
                key={channel.name}
                to={`/channel/${channel.name.toLowerCase()}`}
                className="flex items-center gap-3 px-2 py-2 rounded hover:bg-white/10"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {channel.isLive && (
                      <div className="w-2 h-2 bg-red-500 rounded-full" />
                    )}
                    <span className="text-sm truncate">{channel.name}</span>
                  </div>
                  {channel.isLive && (
                    <div className="text-xs text-white/60">
                      {channel.viewers.toLocaleString()} viewers
                    </div>
                  )}
                  {!channel.isLive && (
                    <div className="text-xs text-white/40">Offline</div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
