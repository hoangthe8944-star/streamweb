import { Link, useNavigate } from "react-router";
import { Search, User, Bell, Settings } from "lucide-react";
import { useState } from "react";
import { NotificationsPopup } from "./NotificationsPopup";
import { UserMenu } from "./UserMenu";

export function TopNav() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/browse?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <>
      <nav className="h-14 bg-[#0e0e10] border-b border-white/10 flex items-center px-4 gap-4">
        <Link to="/" className="flex items-center gap-2 mr-4">
          <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
            <span className="text-black font-bold">T</span>
          </div>
          <span className="font-bold hidden sm:inline">TwitchClone</span>
        </Link>

        <div className="flex-1 max-w-md">
          <form onSubmit={handleSearch} className="flex">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search"
              className="flex-1 bg-[#1f1f23] border border-white/20 rounded-l px-3 py-1.5 text-sm focus:outline-none focus:border-white/40"
            />
            <button
              type="submit"
              className="bg-[#2c2c30] border border-l-0 border-white/20 rounded-r px-3 hover:bg-[#3a3a3d]"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>

        <div className="flex items-center gap-4 ml-auto">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 hover:bg-white/10 rounded relative"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          <Link to="/settings" className="p-2 hover:bg-white/10 rounded">
            <Settings className="w-5 h-5" />
          </Link>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="p-2 hover:bg-white/10 rounded"
          >
            <User className="w-5 h-5" />
          </button>
        </div>
      </nav>

      <NotificationsPopup
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
      <UserMenu isOpen={showUserMenu} onClose={() => setShowUserMenu(false)} />
    </>
  );
}
