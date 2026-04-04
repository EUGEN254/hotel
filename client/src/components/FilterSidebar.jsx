import { useState } from "react";

const FilterSidebar = ({ filters, onChange }) => {
  const [price, setPrice] = useState(filters.maxPrice);

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

  return (
    <aside className="w-[200px] flex-shrink-0 p-4 border-r border-border-light hidden md:block">
      <div className="text-[21px] font-medium text-muted-foreground uppercase tracking-wider mb-2.5">
        Room type
      </div>
      {["Single", "Double", "Suite"].map((type) => (
        <label key={type} className="flex items-center gap-2 text-[13px] text-foreground py-1 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.roomTypes.includes(type.toLowerCase())}
            onChange={() => toggleRoomType(type.toLowerCase())}
            className="accent-primary rounded"
          />
          {type}
        </label>
      ))}

      <div className="h-px bg-border-light my-3.5" />

      <div className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-2.5">
        Price / night
      </div>
      <div className="text-[12px] text-muted-foreground mb-1.5">
        Up to KES {price.toLocaleString()}
      </div>
      <input
        type="range"
        min={1000}
        max={10000}
        step={500}
        value={price}
        onChange={(e) => handlePriceChange(Number(e.target.value))}
        className="w-full accent-primary"
      />

      <div className="h-px bg-border-light my-3.5" />

      <div className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-2.5">
        Amenities
      </div>
      {["WiFi", "AC", "Balcony", "Hot water"].map((amenity) => (
        <label key={amenity} className="flex items-center gap-2 text-[13px] text-foreground py-1 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.amenities.includes(amenity)}
            onChange={() => toggleAmenity(amenity)}
            className="accent-primary rounded"
          />
          {amenity}
        </label>
      ))}
    </aside>
  );
};

export default FilterSidebar;