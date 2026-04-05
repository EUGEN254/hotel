import { useState, useRef } from "react";
import { Search } from "lucide-react";
import Navbar from "../components/Navbar";
import heroImg from "../assets/hero-hotel.jpeg";
import { useTheme } from "next-themes";

const Header = ({ onSearch }) => {
  const [checkIn, setCheckIn] = useState("2026-04-10");
  const [checkOut, setCheckOut] = useState("2026-04-13");
  const [roomType, setRoomType] = useState("any");
  const [videoReady, setVideoReady] = useState(false);
  const videoRef = useRef(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const handleSearch = () => {
    onSearch({ checkIn, checkOut, roomType });
  };

  return (
    <section className="relative h-[600px] sm:h-[750px] md:h-[550px] flex flex-col">
      {/* ── Background media ── */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={heroImg}
          alt="Serene Hotel exterior"
          className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-700 ${
            videoReady ? "opacity-0" : "opacity-100"
          }`}
        />
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          onCanPlayThrough={() => setVideoReady(true)}
          className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-700 ${
            videoReady ? "opacity-100" : "opacity-0"
          }`}
          src="https://res.cloudinary.com/dmxvsiwev/video/upload/v1775389550/video_2026-04-05_14-45-16_srfl39.mp4"
        />

        {/* Subtle gradient only at top (for navbar) and bottom (for search bar) */}
        {/* This is NOT a full overlay — just edges so content is readable */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/50" />
      </div>

      {/* Navbar — top */}
      <div className="relative z-10 pt-2 px-2">
        <Navbar />
      </div>

      {/* Spacer — pushes content to bottom */}
      <div className="flex-1" />

      {/* Content — pinned to bottom of hero */}
      <div className="relative z-10 px-6 pb-10 sm:pb-14 max-w-3xl">
        <h1
          className="md:text-6xl sm:text-4xl font-bold tracking-tight  text-white md:mb-5"
          style={{
            textShadow: "0 2px 12px rgba(0,0,0,0.8), 0 1px 3px rgba(0,0,0,0.9)",
          }}
        >
          Find your perfect room
        </h1>
        <p
          className="text-[15px] font-medium text-white mb-5"
          style={{ textShadow: "0 1px 8px rgba(0,0,0,0.8)" }}
        >
          Book directly for the best rates. Instant confirmation.
        </p>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className={`text-[13px] py-2 px-3 border border-white/40 rounded-md focus:outline-none focus:ring-1 focus:ring-white/60 w-full sm:w-auto min-w-[130px] max-w-[150px] ${
              isDark
                ? "bg-transparent text-white"
                : "bg-white/80 text-foreground"
            }`}
          />
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className={`text-[13px] py-2 px-3 border border-white/40 rounded-md focus:outline-none focus:ring-1 focus:ring-white/60 w-full sm:w-auto min-w-[130px] max-w-[150px] ${
              isDark
                ? "bg-transparent text-white"
                : "bg-white/80 text-foreground"
            }`}
          />
          <select
            value={roomType}
            onChange={(e) => setRoomType(e.target.value)}
            className={`text-[13px] py-2 px-3 border border-white/40 rounded-md focus:outline-none focus:ring-1 focus:ring-white/60 w-full sm:w-auto min-w-[120px] max-w-[140px] ${
              isDark
                ? "bg-transparent text-white"
                : "bg-white/80 text-foreground"
            }`}
          >
            <option value="any">Any room type</option>
            <option value="single">Single</option>
            <option value="double">Double</option>
            <option value="suite">Suite</option>
          </select>
          <button
            onClick={handleSearch}
            className="inline-flex items-center justify-center gap-1.5 text-[13px] font-medium py-2 px-5 rounded-md bg-primary text-primary-foreground cursor-pointer whitespace-nowrap hover:opacity-90 transition-opacity w-full sm:w-auto"
          >
            <Search className="w-3.5 h-3.5" />
            Search rooms
          </button>
        </div>
      </div>
    </section>
  );
};

export default Header;
