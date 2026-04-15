import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { useTheme } from "next-themes";

const FilterSidebar = ({ filters, onChange }) => {
  const [price, setPrice] = useState(filters.maxPrice);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const toggleRoomType = (type) => {
    const next = filters.roomTypes.includes(type)
      ? filters.roomTypes.filter((t) => t !== type)
      : [...filters.roomTypes, type];
    onChange({ ...filters, roomTypes: next });
  };

  const toggleAmenity = (amenity) => {
    const next = filters.amenities.includes(amenity)
      ? filters.amenities.filter((a) => a !== amenity)
      : [...filters.amenities, amenity];
    onChange({ ...filters, amenities: next });
  };

  const handlePriceChange = (val) => {
    setPrice(val);
    onChange({ ...filters, maxPrice: val });
  };

  const clearAllFilters = () => {
    onChange({
      roomTypes: ["single", "double", "suite"],
      maxPrice: 50000,
      amenities: [],
    });
    setPrice(50000);
  };

  // Get selected filters summary for mobile button
  const getSelectedFiltersSummary = () => {
    const selectedTypes = filters.roomTypes.length;
    const totalTypes = 3;
    const hasPriceFilter = filters.maxPrice < 10000;
    const amenitiesCount = filters.amenities.length;

    const parts = [];
    if (selectedTypes < totalTypes) {
      parts.push(`${selectedTypes}/${totalTypes} types`);
    }
    if (hasPriceFilter) {
      parts.push(`≤ KES ${filters.maxPrice.toLocaleString()}`);
    }
    if (amenitiesCount > 0) {
      parts.push(`${amenitiesCount} amenities`);
    }

    return parts.length > 0 ? parts.join(" • ") : "All filters";
  };

  const activeFilterCount = () => {
    let count = 0;
    if (filters.roomTypes.length < 3) count += 3 - filters.roomTypes.length;
    if (filters.maxPrice < 10000) count++;
    if (filters.amenities.length > 0) count += filters.amenities.length;
    return count;
  };

  // Filter content to be reused
  const FilterContent = () => (
    <>
      {/* Header with title and clear all */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-border-light">
        <h3 className="text-lg font-semibold text-foreground">Filters</h3>
        <button
          onClick={clearAllFilters}
          className="text-sm text-primary hover:underline"
        >
          Clear all
        </button>
      </div>

      {/* Room Type Section */}
      <div className="mb-6">
        <div className="text-[21px] font-medium text-muted-foreground uppercase tracking-wider mb-2.5">
          Room type
        </div>
        {["Single", "Double", "Suite"].map((type) => (
          <label
            key={type}
            className="flex items-center gap-2 text-[13px] text-foreground py-1 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={filters.roomTypes.includes(type.toLowerCase())}
              onChange={() => toggleRoomType(type.toLowerCase())}
              className="accent-primary rounded"
            />
            {type}
          </label>
        ))}
      </div>

      <div className="h-px bg-border-light my-3.5" />

      {/* Price Section */}
      <div className="mb-6">
        <div className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-2.5">
          Price / night
        </div>
        <div className="text-[12px] text-muted-foreground mb-1.5">
          Up to KES {price.toLocaleString()}
        </div>
        <input
          type="range"
          min={1000}
          max={50000}
          step={500}
          value={price}
          onChange={(e) => handlePriceChange(Number(e.target.value))}
          className="w-full accent-primary"
        />
      </div>

      <div className="h-px bg-border-light my-3.5" />

      {/* Amenities Section */}
      <div className="mb-6">
        <div className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-2.5">
          Amenities
        </div>
        {["WiFi", "AC", "Balcony", "Hot water"].map((amenity) => (
          <label
            key={amenity}
            className="flex items-center gap-2 text-[13px] text-foreground py-1 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={filters.amenities.includes(amenity)}
              onChange={() => toggleAmenity(amenity)}
              className="accent-primary rounded"
            />
            {amenity}
          </label>
        ))}
      </div>

      {/* Apply button for mobile */}
      <button
        onClick={() => setIsMobileFilterOpen(false)}
        className="mt-4 w-full bg-primary text-primary-foreground py-2.5 rounded-md font-medium"
      >
        Apply Filters
      </button>
    </>
  );

  return (
    <>
      {/* Mobile Filter Button - visible only on small screens */}
      <div className="md:hidden mb-6">
        <button
          onClick={() => setIsMobileFilterOpen(true)}
          className="w-full flex items-center justify-between bg-white isDark:bg-gray-800 border border-border-light rounded-lg p-4 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium text-foreground">Filter Rooms</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
              {getSelectedFiltersSummary()}
            </span>
            {activeFilterCount() > 0 && (
              <span className="text-sm font-medium bg-primary text-primary-foreground px-3 py-1 rounded-full">
                {activeFilterCount()}
              </span>
            )}
          </div>
        </button>
      </div>

      {/* Desktop Sidebar - visible on medium screens and up */}
      <aside className="hidden md:block w-[260px] flex-shrink-0 p-4 border-r border-border-light">
        <FilterContent />
      </aside>

      {/* Mobile Filter Drawer - slides from right */}
      {isMobileFilterOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300"
            onClick={() => setIsMobileFilterOpen(false)}
          />

          {/* Drawer - slides from right */}
          <div className="fixed top-0 right-0 h-full w-full max-w-[320px] bg-background shadow-xl z-50 md:hidden transform transition-transform duration-300 ease-out">
            <div className="h-full flex flex-col">
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-4 border-b border-border-light">
                <h2 className="text-lg font-semibold text-foreground">
                  Filter Rooms
                </h2>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 hover:bg-muted rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-4">
                <FilterContent />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default FilterSidebar;
