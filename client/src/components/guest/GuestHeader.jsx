import { User, Bell, ChevronDown, Settings, LogOut, UserCircle } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const GuestHeader = ({ guestName, isMobile, onMenuClick }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleProfileClick = () => {
    setIsDropdownOpen(false);
    navigate("/guest/profile");
  };

  const handleSettingsClick = () => {
    setIsDropdownOpen(false);
    navigate("/guest/settings");
  };

  

  return (
    <header className="bg-card border-b border-border-light px-4 py-3 md:px-6 md:py-4 w-full">
      <div className="flex items-center justify-between gap-3">
        {/* Left section - Welcome Message with conditional padding for mobile */}
        <div className={`flex-1 min-w-0 ${isMobile ? "ml-10" : ""}`}>
          <h1 className="text-sm sm:text-base md:text-xl font-semibold text-foreground truncate">
            Welcome back, <span className="text-primary">{guestName}</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5 hidden sm:block">
            Manage your bookings and profile here
          </p>
          <p className="text-xs text-muted-foreground mt-0.5 sm:hidden">
            Guest Portal
          </p>
        </div>

        {/* Right section - Icons and Profile */}
        <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
          {/* Notification Bell - hide on very small screens or keep */}
          <button className="relative p-1.5 md:p-2 rounded-full hover:bg-secondary transition-colors">
            <Bell className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground" />
            <span className="absolute top-0 right-0 w-1.5 h-1.5 md:w-2 md:h-2 bg-destructive rounded-full"></span>
          </button>

          {/* User Avatar with Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-1 md:gap-2 p-1 rounded-lg hover:bg-secondary transition-all duration-200"
            >
              <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary" />
              </div>
              {/* Hide name on small screens to save space */}
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-foreground max-w-[100px] truncate">
                  {guestName}
                </p>
                <p className="text-xs text-muted-foreground">Guest</p>
              </div>
              <ChevronDown 
                className={`w-3.5 h-3.5 md:w-4 md:h-4 text-muted-foreground transition-transform duration-200 ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-card border border-border-light rounded-lg shadow-lg overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200">
                {/* User Info Section */}
                <div className="px-4 py-3 border-b border-border-light bg-secondary/30">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {guestName}
                      </p>
                      <p className="text-xs text-muted-foreground">Guest Account</p>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  <button
                    onClick={handleProfileClick}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors"
                  >
                    <UserCircle className="w-4 h-4 text-muted-foreground" />
                    <span>My Profile</span>
                  </button>
                  
                  <button
                    onClick={handleSettingsClick}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors"
                  >
                    <Settings className="w-4 h-4 text-muted-foreground" />
                    <span>Settings</span>
                  </button>
                  
                  <div className="border-t border-border-light my-1"></div>
                  
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      logout();
                    } }
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default GuestHeader;