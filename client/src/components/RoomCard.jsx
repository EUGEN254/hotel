import { cn } from "../lib/utils";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "../components/ui/tooltip";

const badgeStyles = {
  single: "bg-badge-single text-badge-single-text",
  double: "bg-badge-double text-badge-double-text",
  suite: "bg-badge-suite text-badge-suite-text",
};

const RoomCard = ({ room }) => {
  const isAvailable = room.available;

  // For unavailable rooms, wrap the entire card in a tooltip
  if (!isAvailable) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="border border-border-light rounded-lg overflow-hidden bg-card opacity-50 cursor-not-allowed">
            <div className="aspect-[3/2] overflow-hidden bg-secondary">
              <img
                src={room.image}
                alt={`${room.name} — ${room.type} room`}
                loading="lazy"
                width={960}
                height={640}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-3">
              <span
                className={cn(
                  "text-[15px] font-medium px-2 py-0.5 rounded-full inline-block mb-1.5",
                  "bg-badge-occupied text-badge-occupied-text",
                )}
              >
                {room.type.charAt(0).toUpperCase() + room.type.slice(1)}
              </span>
              <div className="text-md font-medium text-foreground mb-0.5">
                {room.name}
              </div>
              <div className="text-[12px] text-muted-foreground mb-2 flex items-center gap-1">
                <span className="w-[9px] h-[9px] rounded-full inline-block bg-status-occupied" />
                Occupied
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-foreground">
                  KES {room.price.toLocaleString()}
                  <span className="text-[17px] font-normal text-muted-foreground ml-0.5">
                    / night
                  </span>
                </div>
                <button
                  disabled
                  className="text-[12px] font-medium py-1 px-3 rounded-md border transition-colors border-border text-muted-foreground opacity-50 cursor-not-allowed"
                >
                  Unavailable
                </button>
              </div>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent className="bg-primary">
          <p className="text-xs font-medium text-center text-primary-foreground">
            This room is currently occupied
          </p>
        </TooltipContent>
      </Tooltip>
    );
  }

  // For available rooms, render normally without tooltip
  return (
    <div className="border border-border-light rounded-lg overflow-hidden bg-card transition-all duration-200 group cursor-pointer hover:border-foreground/20 hover:shadow-sm">
      <div className="aspect-[3/2] overflow-hidden bg-secondary">
        <img
          src={room.image}
          alt={`${room.name} — ${room.type} room`}
          loading="lazy"
          width={960}
          height={640}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="p-3">
        <span
          className={cn(
            "text-[15px] font-medium px-2 py-0.5 rounded-full inline-block mb-1.5",
            badgeStyles[room.type],
          )}
        >
          {room.type.charAt(0).toUpperCase() + room.type.slice(1)}
        </span>
        <div className="text-md font-medium text-foreground mb-0.5">
          {room.name}
        </div>
        <div className="text-[12px] text-muted-foreground mb-2 flex items-center gap-1">
          <span className="w-[9px] h-[9px] rounded-full inline-block bg-status-available" />
          Available · Floor {room.floor}
        </div>
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-foreground">
            KES {room.price.toLocaleString()}
            <span className="text-[17px] font-normal text-muted-foreground ml-0.5">
              / night
            </span>
          </div>
          <button className="text-[12px] font-medium py-1 px-3 rounded-md border transition-colors border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            Book
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
