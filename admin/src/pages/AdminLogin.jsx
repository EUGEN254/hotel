import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "../components/ui/toaster";
import { useAuth } from "../contexts/AuthContext";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login, loading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login({ email, password });
      console.log("Logged in user:", user);
      if (user.role === "admin") {
        navigate("/admin/rooms");
        toast.success("Logged in successfully");
      }
    } catch (error) {
      toast.error(error.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F3D30]">
      <div className="bg-white rounded-xl w-full max-w-sm p-8">
        <div className="text-center mb-8">
          <div className="text-[#C9A84C] font-semibold text-sm tracking-widest mb-1">
            SERENE HOTEL
          </div>
          <h1 className="text-lg font-semibold text-foreground">
            Admin sign in
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5 uppercase tracking-wide">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="admin@serenehotel.com"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5 uppercase tracking-wide">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2.5 bg-[#0F3D30] text-[#C9A84C] rounded-lg text-sm font-medium hover:bg-[#1A5C42] transition-colors mt-2"
          >
            {loading ? "Logging in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
