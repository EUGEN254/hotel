import { useState, useMemo } from "react";
import { Search, Calendar } from "lucide-react";
import FilterSidebar from "../../components/FilterSidebar";
import RoomCard from "../../components/RoomCard";

// Import room images
import roomSingleImg from "../../assets/room-single.jpeg";
import roomDoubleImg from "../../assets/room-double.jpeg";
import roomSuiteImg from "../../assets/room-suite.jpeg";
import roomOccupiedImg from "../../assets/room-occupied.jpeg";

// Room data matching the LandingPage structure
const rooms = [
  { id: "101", name: "Room 101", type: "single", floor: 1, price: 2500, available: true, image: roomSingleImg },
  { id: "205", name: "Room 205", type: "double", floor: 2, price: 4000, available: true, image: roomDoubleImg },
  { id: "301", name: "Room 301", type: "suite", floor: 3, price: 7500, available: true, image: roomSuiteImg },
  { id: "102", name: "Room 102", type: "single", floor: 1, price: 2500, available: false, image: roomOccupiedImg },
];

const GuestBrowseRooms = () => {
  // Date state for search
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  
  // Filter state - same as LandingPage
  const [filters, setFilters] = useState({
    roomTypes: ["single", "double", "suite"],
    maxPrice: 10000,
    amenities: ["WiFi"],
  });

  // Filter rooms - same logic as LandingPage
  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      // Filter by room type
      if (!filters.roomTypes.includes(room.type)) return false;
      // Filter by price
      if (room.price > filters.maxPrice) return false;
      // For amenities, you would need amenity data in rooms
      // This is simplified for now
      return true;
    });
  }, [filters]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (checkIn && checkOut) {
      console.log("Searching rooms from", checkIn, "to", checkOut);
      // In production: fetch available rooms for these dates
    } else {
      console.log("Please select check-in and check-out dates");
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Browse Rooms</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Find and book your perfect room
        </p>
      </div>

      {/* Date Search Bar */}
      <div className="bg-card border border-border-light rounded-lg p-4">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              CHECK-IN DATE
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
          </div>
          <div className="flex-1">
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              CHECK-OUT DATE
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              Search Rooms
            </button>
          </div>
        </form>
      </div>

      {/* Results Summary */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-medium text-foreground">{filteredRooms.length}</span> rooms
          {checkIn && checkOut && (
            <span className="ml-1">
              for <span className="font-medium text-foreground">{checkIn}</span> to{" "}
              <span className="font-medium text-foreground">{checkOut}</span>
            </span>
          )}
        </p>
      </div>

      {/* Rooms Section with Filter Sidebar - Same structure as LandingPage */}
      <div className="flex gap-6">
        <FilterSidebar filters={filters} onChange={setFilters} />
        <main className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
          {filteredRooms.length === 0 && (
            <div className="text-center py-16 bg-card border border-border-light rounded-lg">
              <p className="text-muted-foreground text-sm">
                No rooms match your filters. Try adjusting your criteria.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default GuestBrowseRooms;