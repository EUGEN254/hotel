import {
  LayoutDashboard,
  Calendar,
  Search,
  User,
  Receipt,
  LogOut,
  Home,
  X,
  Settings,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const GuestSidebar = ({ activeTab, setActiveTab, isMobile, onClose }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "browse", label: "Browse Rooms", icon: Search },
    { id: "bookings", label: "My Bookings", icon: Calendar },
    { id: "profile", label: "My Profile", icon: User },
    { id: "billing", label: "Billing", icon: Receipt },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const handleNavigation = (tabId) => {
    setActiveTab(tabId);
    if (isMobile && onClose) {
      onClose();
    }
  };

  return (
    <aside className="w-64 bg-card border-r border-border-light h-full flex flex-col">
      {/* Close button for mobile */}
      {isMobile && (
        <div className="flex justify-end p-4 border-b border-border-light">
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-secondary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Logo Section */}
      <div className={`${isMobile ? "px-4 pb-4" : "p-4"} border-b border-border-light`}>
        <div 
          onClick={() => {
            navigate("/");
            if (isMobile && onClose) onClose();
          }}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Home className="w-8 h-8 text-primary" />
          <span className="text-xl font-bold text-foreground">
            Serene Hotel
          </span>
        </div>
        <p className="text-md text-muted-foreground mt-3">Guest Portal</p>
      </div>

      {/* Scrollable Navigation Area with custom scrollbar class */}
      <div className="flex-1 overflow-y-auto min-h-0 sidebar-scrollable">
        <nav className="px-4 py-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                  ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }
                `}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Logout Button */}
      <div className="p-4 border-t border-border-light mt-auto">
        <button
          onClick={() => {
            logout();
            if (isMobile && onClose) onClose();
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default GuestSidebar;