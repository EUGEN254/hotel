import { Button } from "../components/ui/button";
import { ArrowRight } from "lucide-react";
import { Menu } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <>
      <nav className="flex items-center justify-between px-6 sm:px-8 py-2 sm:py-1 rounded-full backdrop-blur-md bg-white/10 shadow-lg mx-2 sm:mx-0">
        <span className="text-[18px] sm:text-[25px] font-bold tracking-tight text-primary-foreground drop-shadow-sm">
          Serene Hotel
        </span>

        {/* Desktop Navigation - Hidden on mobile */}
        <div className="hidden sm:flex items-center gap-5">
          <a
            href="#rooms"
            className="text-[15px] text-primary-foreground transition-colors hover:underline underline-offset-4 decoration-1"
          >
            Rooms
          </a>
          <a
            href="#about"
            className="text-[15px] text-primary-foreground transition-colors hover:underline underline-offset-4 decoration-1"
          >
            About
          </a>
          <a
            href="#contact"
            className="text-[15px] text-primary-foreground transition-colors hover:underline underline-offset-4 decoration-1"
          >
            Contact
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="sm:hidden text-primary-foreground p-1"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Desktop Buttons */}
        <div className="hidden sm:flex gap-4">
          {user ? (
            <Button
              variant="outline"
              size="sm"
              className="text-[13px] sm:text-[15px] font-medium h-7 sm:h-8 px-3 sm:px-3.5 border-primary-foreground/30 text-primary-foreground bg-white/10 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground rounded-full"
              onClick={() => navigate("/guest/browse")}
            >
              Book Room
              <ArrowRight className="w-3.5 h-3.5 rotate-340" />
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="text-[13px] sm:text-[15px] font-medium h-7 sm:h-8 px-3 sm:px-3.5 border-primary-foreground/30 text-primary-foreground bg-white/10 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground rounded-full"
              onClick={() => navigate("/auth")}
            >
              Book Room
              <ArrowRight className="w-3.5 h-3.5 rotate-340" />
            </Button>
          )}
          {user ? (
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-[13px] font-medium h-8 px-3 border-primary-foreground/30 text-primary-foreground bg-white/10 backdrop-blur-sm hover:bg-primary-foreground/20 hover:text-primary-foreground"
              onClick={() => navigate("/guest/dashboard")}
            >
              Dashboard
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-[13px] font-medium h-8 px-3 border-primary-foreground/30 text-primary-foreground bg-white/10 backdrop-blur-sm hover:bg-primary-foreground/20 hover:text-primary-foreground"
              onClick={() => navigate("/auth")}
            >
              Sign in
            </Button>
          )}
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="sm:hidden absolute top-16 left-4 right-4 z-20 rounded-xl backdrop-blur-md bg-white/20 shadow-lg border border-white/30 p-4">
          <div className="flex flex-col gap-3">
            <a
              href="#rooms"
              onClick={() => setIsMenuOpen(false)}
              className="text-[15px] text-primary-foreground py-2 px-3 hover:bg-white/10 rounded-lg transition-colors"
            >
              Rooms
            </a>
            <a
              href="#about"
              onClick={() => setIsMenuOpen(false)}
              className="text-[15px] text-primary-foreground py-2 px-3 hover:bg-white/10 rounded-lg transition-colors"
            >
              About
            </a>
            <a
              href="#contact"
              onClick={() => setIsMenuOpen(false)}
              className="text-[15px] text-primary-foreground py-2 px-3 hover:bg-white/10 rounded-lg transition-colors"
            >
              Contact
            </a>
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                className="text-[13px] sm:text-[15px] font-medium h-7 sm:h-8 px-3 sm:px-3.5 border-primary-foreground/30 text-primary-foreground bg-white/10 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground rounded-full"
              >
                Book Room
                <ArrowRight className="w-3.5 h-3.5 ml-1 rotate-45" />
              </Button>
              {user ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-[13px] font-medium h-8 px-3 border-primary-foreground/30 text-primary-foreground bg-white/10 backdrop-blur-sm hover:bg-primary-foreground/20 hover:text-primary-foreground rounded-full"
                  onClick={() => navigate("/guest/dashboard")}
                >
                  Dashboard
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-[13px] font-medium h-8 px-3 border-primary-foreground/30 text-primary-foreground bg-white/10 backdrop-blur-sm hover:bg-primary-foreground/20 hover:text-primary-foreground rounded-full"
                  onClick={() => navigate("/auth")}
                >
                  Sign in
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
