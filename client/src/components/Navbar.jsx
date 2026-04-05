import { Button } from "../components/ui/button";
import { ArrowRight, Menu, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import ThemeToggle from "./ui/themeToggle";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <>
      <nav className="flex items-center justify-between px-6 sm:px-8 py-2 sm:py-1 rounded-full backdrop-blur-md bg-black/20 mx-2 sm:mx-0">
        {/* Logo */}
        <span className="text-[18px] sm:text-[22px] font-bold tracking-tight text-white drop-shadow-sm">
          Serene Hotel
        </span>

        {/* Desktop nav links */}
        <div className="hidden sm:flex items-center gap-5">
          {["#rooms", "#about", "#contact"].map((href) => (
            <a
              key={href}
              href={href}
              className="text-[14px] text-white/90 hover:text-white transition-colors hover:underline underline-offset-4 decoration-1 drop-shadow-sm"
            >
              {href.replace("#", "").charAt(0).toUpperCase() + href.slice(2)}
            </a>
          ))}
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="sm:hidden text-white p-1"
        >
          {isMenuOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>

        {/* Desktop buttons */}
        <div className="hidden sm:flex gap-3">
         <ThemeToggle className=" bg-white/10 rounded-full p-4 h-8 hover:bg-primary shadow-lg" />
         
          <Button
            variant="outline"
            size="sm"
            className="text-[13px] font-medium h-8 px-4 border-white/50 text-white bg-white/10 hover:bg-primary hover:text-foreground rounded-full transition-colors"
            onClick={() => navigate(user ? "/guest/browse" : "/auth")}
          >
            Book Room
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-[13px] font-medium h-8 px-4 border-white/50 text-white bg-white/10 hover:bg-primary hover:text-foreground rounded-full transition-colors"
            onClick={() => navigate(user ? "/guest/dashboard" : "/auth")}
          >
            {user ? "Dashboard" : "Sign in"}
          </Button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {isMenuOpen && (
        <div className="sm:hidden absolute top-16 left-4 right-4 z-20 rounded-xl backdrop-blur-md bg-black/50 border border-white/20 p-4">
         

          <div className="flex flex-col gap-1">
            {[
              { href: "#rooms", label: "Rooms" },
              { href: "#about", label: "About" },
              { href: "#contact", label: "Contact" },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="text-[14px] text-white py-2 px-3 hover:bg-white/10 rounded-lg transition-colors"
              >
                {item.label}
              </a>
            ))}
            <div className="flex gap-2 pt-3 border-t border-white/20 mt-2">
              <Button
                size="sm"
                className="flex-1 text-[13px] font-medium h-8 bg-white text-foreground hover:bg-white/90 rounded-full"
                onClick={() => {
                  navigate(user ? "/guest/browse" : "/auth");
                  setIsMenuOpen(false);
                }}
              >
                Book Room
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 text-[13px] font-medium h-8 border-white/50 text-white bg-white/10 hover:bg-primary rounded-full"
                onClick={() => {
                  navigate(user ? "/guest/dashboard" : "/auth");
                  setIsMenuOpen(false);
                }}
              >
                {user ? "Dashboard" : "Sign in"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
