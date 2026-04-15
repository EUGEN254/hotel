import { useState, useMemo } from "react";
import { Search, Calendar } from "lucide-react";
import FilterSidebar from "../../components/FilterSidebar";
import RoomCard from "../../components/RoomCard";
import useRooms from "../../hooks/guest/useRooms";
import RoomCardSkeleton from "../../components/ui/RoomCardSkeleton";

const GuestBrowseRooms = () => {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [filters, setFilters] = useState({
    roomTypes: ["single", "double", "suite"],
    maxPrice: 10000,
    amenities: ["WiFi"],
  });

  // Fetch only available rooms (default backend behaviour)
  const { rooms, loading, error } = useRooms({ status: "available" });
  console.log(rooms);

  // Client-side filter on top of the API results
  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      if (!filters.roomTypes.includes(room.type)) return false;
      if (room.price_per_night > filters.maxPrice) return false;
      return true;
    });
  }, [rooms, filters]);

  const handleSearch = (e) => {
    e.preventDefault();
    // TODO: pass checkIn / checkOut to the API once availability endpoint exists
    console.log("Searching from", checkIn, "to", checkOut);
  };

  if (loading) {
    return (
      <div className="flex flex-col md:flex-row gap-6">
        <div className="hidden md:block w-[260px] flex-shrink-0" />{" "}
        {/* sidebar placeholder */}
        <main className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <RoomCardSkeleton key={i} />
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center space-y-2">
          <p className="text-sm font-medium text-foreground">
            Failed to load rooms
          </p>
          <p className="text-xs text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Browse Rooms</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Find and book your perfect room
        </p>
      </div>

      {/* Date search bar */}
      <div className="bg-card border border-border-light rounded-lg p-4">
        <form
          onSubmit={handleSearch}
          className="flex flex-col sm:flex-row gap-3"
        >
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
              <Search className="w-4 h-4" /> Search Rooms
            </button>
          </div>
        </form>
      </div>

      {/* Results summary */}
      <p className="text-sm text-muted-foreground">
        Showing{" "}
        <span className="font-medium text-foreground">
          {filteredRooms.length}
        </span>{" "}
        rooms
        {checkIn && checkOut && (
          <span className="ml-1">
            for <span className="font-medium text-foreground">{checkIn}</span>{" "}
            to <span className="font-medium text-foreground">{checkOut}</span>
          </span>
        )}
      </p>

      {/* Rooms grid with filter sidebar */}
      <div className="flex flex-col md:flex-row gap-6">
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
                No rooms match your filters.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default GuestBrowseRooms;
