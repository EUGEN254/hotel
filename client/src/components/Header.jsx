import { useState } from "react";
import { Search } from "lucide-react";
import Navbar from "../components/Navbar";
import heroImg from "../assets/hero-hotel.jpeg";

const Header = ({ onSearch }) => {
  const [checkIn, setCheckIn] = useState("2026-04-10");
  const [checkOut, setCheckOut] = useState("2026-04-13");
  const [roomType, setRoomType] = useState("any");

  const handleSearch = () => {
    onSearch({ checkIn, checkOut, roomType });
  };

  return (
    <section className="relative min-h-[450px] sm:h-[700px] md:h-[500px] pt-1">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={heroImg}
          alt="Serene Hotel exterior"
          width={1920}
          height={1920}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/60 via-foreground/40 to-foreground/70" />
      </div>

      {/* Navbar overlaid */}
      <Navbar />

      {/* Content */}
      <div className="relative z-[1] px-6 pt-40 pb-14 sm:pt-52 sm:pb-20 max-w-3xl">
        <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-primary-foreground drop-shadow-sm">
          Find your perfect room
        </h1>
        <p className="text-[14px] text-primary-foreground/70 mb-6">
          Book directly for the best rates. Instant confirmation.
        </p>
        {/* Mobile: stacked layout, Desktop: original layout */}
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="text-[13px] py-2 px-3 border border-primary-foreground/20 rounded-md bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/50 min-w-[130px] max-w-[150px] focus:outline-none focus:ring-1 focus:ring-primary-foreground/40 backdrop-blur-sm w-full sm:w-auto"
          />
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="text-[13px] py-2 px-3 border border-primary-foreground/20 rounded-md bg-primary-foreground/10 text-primary-foreground min-w-[130px] max-w-[150px] focus:outline-none focus:ring-1 focus:ring-primary-foreground/40 backdrop-blur-sm w-full sm:w-auto"
          />
          <select
            value={roomType}
            onChange={(e) => setRoomType(e.target.value)}
            className="text-[13px] py-2 px-3 border border-primary-foreground/20 rounded-md bg-primary-foreground/10 text-primary-foreground min-w-[120px] max-w-[140px] focus:outline-none focus:ring-1 focus:ring-primary-foreground/40 backdrop-blur-sm w-full sm:w-auto"
          >
            <option value="any" className="text-foreground">Any room type</option>
            <option value="single" className="text-foreground">Single</option>
            <option value="double" className="text-foreground">Double</option>
            <option value="suite" className="text-foreground">Suite</option>
          </select>
          <button
            onClick={handleSearch}
            className="inline-flex items-center justify-center gap-1.5 text-[13px] font-medium py-2 px-5 border-none rounded-md bg-primary text-primary-foreground cursor-pointer whitespace-nowrap hover:opacity-90 transition-opacity w-full sm:w-auto"
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