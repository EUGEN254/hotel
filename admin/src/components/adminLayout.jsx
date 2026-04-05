import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";


const navItems = [
  { label: "Dashboard", path: "/admin" },
  { label: "Rooms", path: "/admin/rooms" },
  { label: "Bookings", path: "/admin/bookings" },
  { label: "Guests", path: "/admin/guests" },
  { label: "Billing", path: "/admin/billing" },
  { label: "Reports", path: "/admin/reports" },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/auth");
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* ── Sidebar ── */}
      <aside className="w-52 flex-shrink-0 bg-[#0F3D30] flex flex-col">
        {/* Brand */}
        <div className="px-5 py-5 border-b border-[#1A5C42]">
          <div className="text-[#C9A84C] font-semibold text-sm tracking-widest">
            SERENE HOTEL
          </div>
          <div className="text-[#4A9478] text-xs mt-1">Admin portal</div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/admin"} // exact match for dashboard only
              className={({ isActive }) =>
                `flex items-center w-full px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-[#C9A84C] text-[#0F3D30] font-medium"
                    : "text-[#6DBD9E] hover:bg-[#1A5C42] hover:text-white"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User footer */}
        <div className="px-4 py-4 border-t border-[#1A5C42]">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-[#C9A84C] flex items-center justify-center text-[#0F3D30] text-xs font-semibold flex-shrink-0">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <div className="text-xs text-[#9FD4BF] font-medium truncate">
                {user?.name}
              </div>
              <div className="text-xs text-[#4A9478] capitalize">{user?.role}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full text-left text-xs text-[#4A9478] hover:text-white px-2 py-1 rounded transition-colors"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* ── Main content — pages render here ── */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}