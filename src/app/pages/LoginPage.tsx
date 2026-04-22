import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { Mail, Lock, Loader2 } from "lucide-react";
import authApi from "../../../api/authApi"; // chỉnh path nếu cần

export default function LoginPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      const res = await authApi.login(form);

      // ✅ lưu token + user
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data));

      // ✅ redirect
      navigate("/");

    } catch (err: any) {
      setError("Email hoặc mật khẩu không đúng");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1498736297812-3a08021f206f?q=80&w=1179&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
      }}
    >
      <div className="absolute inset-0 bg-black/70"></div>

      <div className="relative z-10 w-full max-w-md bg-[#1a1026]/90 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/10">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">
          Đăng nhập
        </h2>

        {error && (
          <div className="mb-4 p-2 bg-red-500/20 border border-red-500 text-red-400 text-sm rounded text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-sm text-white/70">Email</label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-2.5 w-4 h-4 text-white/40" />
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="w-full pl-10 pr-3 py-2 rounded bg-[#0f0a18] border border-white/20 text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-white/70">Password</label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-2.5 w-4 h-4 text-white/40" />
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => handleChange("password", e.target.value)}
                className="w-full pl-10 pr-3 py-2 rounded bg-[#0f0a18] border border-white/20 text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 mt-4 rounded-lg bg-purple-700 hover:bg-purple-800 text-white font-semibold flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin w-4 h-4" /> : "Đăng nhập"}
          </button>
        </form>

        <p className="text-center text-white/60 text-sm mt-6">
          Chưa có tài khoản?{" "}
          <Link to="/register" className="text-purple-400 hover:underline">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
}