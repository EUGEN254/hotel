import { useState, useMemo } from "react";
import FilterSidebar from "../components/FilterSidebar";
import RoomCard from "../components/RoomCard";
import AboutSection from "../components/AboutSection";
import AmenitiesSection from "../components/AmenitiesSection";
import TestimonialsSection from "../components/TestimonialsSection";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";
import roomSingleImg from "../assets/room-single.jpeg";
import roomDoubleImg from "../assets/room-double.jpeg";
import roomSuiteImg from "../assets/room-suite.jpeg";
import roomOccupiedImg from "../assets/room-occupied.jpeg";
import Header from "../components/Header";

const rooms = [
  {
    id: "101",
    name: "Room 101",
    type: "single",
    floor: 1,
    price: 2500,
    available: true,
    image: roomSingleImg,
  },
  {
    id: "205",
    name: "Room 205",
    type: "double",
    floor: 2,
    price: 4000,
    available: true,
    image: roomDoubleImg,
  },
  {
    id: "301",
    name: "Room 301",
    type: "suite",
    floor: 3,
    price: 7500,
    available: true,
    image: roomSuiteImg,
  },
  {
    id: "102",
    name: "Room 102",
    type: "single",
    floor: 1,
    price: 2500,
    available: false,
    image: roomOccupiedImg,
  },
];

const LandingPage = () => {
  const [filters, setFilters] = useState({
    roomTypes: ["single", "double", "suite"],
    maxPrice: 10000,
    amenities: ["WiFi"],
  });
  const [searchType, setSearchType] = useState("any");

  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      if (searchType !== "any" && room.type !== searchType) return false;
      if (!filters.roomTypes.includes(room.type)) return false;
      if (room.price > filters.maxPrice) return false;
      return true;
    });
  }, [filters, searchType]);

  const handleSearch = ({ roomType }) => {
    setSearchType(roomType);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={handleSearch} />

      {/* Rooms Section */}
      <section id="rooms" className="py-10 px-6 max-w-6xl mx-auto">
        <p className="text-[28px] font-medium uppercase tracking-widest text-primary mb-3 text-center">
          Accommodation
        </p>
        <h2 className="text-2xl font-medium tracking-tight text-foreground mb-8 text-center">
          Browse available rooms
        </h2>

        <div className="flex flex-col md:flex-row gap-6">
          <FilterSidebar filters={filters} onChange={setFilters} />
          <main className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRooms.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>
            {filteredRooms.length === 0 && (
              <div className="text-center py-16 text-muted-foreground text-sm">
                No rooms match your filters. Try adjusting your criteria.
              </div>
            )}
          </main>
        </div>
      </section>

      <AboutSection />
      <AmenitiesSection />
      <TestimonialsSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default LandingPage;
