const RoomCardSkeleton = () => (
  <div className="border border-border-light rounded-lg overflow-hidden bg-card animate-pulse">
    <div className="aspect-[3/2] bg-muted" />
    <div className="p-3 space-y-2">
      <div className="h-5 w-16 bg-muted rounded-full" />
      <div className="h-4 w-24 bg-muted rounded" />
      <div className="h-3 w-32 bg-muted rounded" />
      <div className="flex justify-between items-center pt-1">
        <div className="h-4 w-20 bg-muted rounded" />
        <div className="h-7 w-14 bg-muted rounded-md" />
      </div>
    </div>
  </div>
);

export default RoomCardSkeleton;