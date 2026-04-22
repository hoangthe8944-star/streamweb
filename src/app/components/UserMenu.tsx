import { useState, useEffect } from "react";
import { Link } from "react-router";
import { User, Settings, CreditCard, HelpCircle, LogOut, Moon, Lock, Mail, Loader2 } from "lucide-react";
import authApi from "../../../api/authApi";
import userApi, { UserDto } from "../../../api/userApi";

interface UserMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UserMenu({ isOpen, onClose }: UserMenuProps) {
  const [user, setUser] = useState<UserDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  // 1. Kiểm tra và lấy thông tin User khi mở menu
  useEffect(() => {
    const fetchMe = async () => {
      const token = localStorage.getItem("token");
      if (token && isOpen) {
        try {
          const res = await userApi.getMe();
          setUser(res.data);
        } catch (err) {
          // Nếu token hết hạn hoặc lỗi, xóa sạch
          handleLogout();
        }
      }
    };
    fetchMe();
  }, [isOpen]);

  if (!isOpen) return null;

  // 2. Hàm đăng nhập
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // Gọi API login
      const res = await authApi.login(credentials);
      // Lưu token vào localStorage (axiosConfig sẽ tự động lấy token này cho các request sau)
      localStorage.setItem("token", res.data.token);
      
      // Lấy thông tin chi tiết user ngay sau khi login
      const meRes = await userApi.getMe();
      setUser(meRes.data);
      
      // Reset form và có thể reload trang nếu cần
      setCredentials({ email: "", password: "" });
    } catch (err: any) {
      setError("Email hoặc mật khẩu không đúng");
    } finally {
      setLoading(false);
    }
  };

  // 3. Hàm đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    onClose();
    window.location.reload(); 
  };

  const menuItems = [
    { icon: User, label: "Profile", to: `/profile/${user?.id}` },
    { icon: Settings, label: "Settings", to: "/settings" },
    { icon: CreditCard, label: "Subscriptions", to: "/settings" },
    { icon: Moon, label: "Dark Mode", to: "#", action: "toggle-theme" },
    { icon: HelpCircle, label: "Help", to: "/help" },
    { icon: LogOut, label: "Log Out", to: "#", action: "logout", danger: true },
  ];

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />

      <div className="fixed top-16 right-4 w-72 bg-[#0e0e10] border border-white/20 rounded-lg shadow-2xl z-50 overflow-hidden">
        
        {user ? (
          /* --- GIAO DIỆN KHI ĐÃ ĐĂNG NHẬP --- */
          <>
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                {user.avatar ? (
                  <img src={user.avatar} className="w-12 h-12 rounded-full object-cover border border-purple-500" alt="avatar" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center text-xl font-bold uppercase">
                    {user.username.charAt(0)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">{user.username}</div>
                  <div className="text-xs text-green-400 flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    Trực tuyến
                  </div>
                </div>
              </div>
            </div>

            <div className="py-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                if (item.to === "#") {
                  return (
                    <button
                      key={item.label}
                      onClick={() => {
                        if (item.action === "logout") handleLogout();
                        onClose();
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/10 transition-colors ${
                        item.danger ? "text-red-400" : ""
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </button>
                  );
                }
                return (
                  <Link
                    key={item.label}
                    to={item.to}
                    onClick={onClose}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/10 transition-colors"
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </>
        ) : (
          /* --- GIAO DIỆN KHI CHƯA ĐĂNG NHẬP (FORM LOGIN) --- */
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4 text-center">Đăng nhập vào Twitch</h2>
            
            {error && <div className="mb-4 p-2 bg-red-500/20 border border-red-500 text-red-500 text-xs rounded text-center">{error}</div>}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase text-white/60 mb-1 block">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-white/40" />
                  <input
                    type="email"
                    required
                    className="w-full bg-[#18181b] border border-white/20 rounded px-10 py-2 focus:border-purple-500 outline-none text-sm"
                    placeholder="email@example.com"
                    value={credentials.email}
                    onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-white/60 mb-1 block">Mật khẩu</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-white/40" />
                  <input
                    type="password"
                    required
                    className="w-full bg-[#18181b] border border-white/20 rounded px-10 py-2 focus:border-purple-500 outline-none text-sm"
                    placeholder="••••••••"
                    value={credentials.password}
                    onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 rounded transition-colors text-sm flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Đăng nhập"}
              </button>
            </form>
            <div className="mt-4 text-center text-xs text-white/60">
              Chưa có tài khoản? <Link to="/register" className="text-purple-400 hover:underline">Đăng ký ngay</Link>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-3 border-t border-white/10 text-xs text-white/60">
          <div className="flex justify-between">
            <a href="#" className="hover:text-white">Điều khoản</a>
            <a href="#" className="hover:text-white">Bảo mật</a>
            <a href="#" className="hover:text-white">Giới thiệu</a>
          </div>
        </div>
      </div>
    </>
  );
}