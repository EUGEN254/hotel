import { Calendar, Clock, CreditCard, Star } from "lucide-react";

const GuestDashboard = () => {
  // Mock data - will be replaced with API data
  const activeBooking = {
    id: "BK-001",
    roomNumber: "205",
    roomType: "Double Room",
    checkIn: "2026-04-10",
    checkOut: "2026-04-13",
    nights: 3,
    totalPrice: 12000,
    status: "confirmed",
    image: "/room-double.jpg",
  };

  const stats = [
    { label: "Total Stays", value: "3", icon: Calendar, color: "text-primary" },
    { label: "Nights Stayed", value: "8", icon: Clock, color: "text-blue-500" },
    { label: "Total Spent", value: "KES 24,500", icon: CreditCard, color: "text-green-500" },
  ];

  const recentBookings = [
    { id: "BK-001", room: "205", checkIn: "Apr 10, 2026", status: "upcoming", amount: 12000 },
    { id: "BK-002", room: "101", checkIn: "Mar 15, 2026", status: "completed", amount: 7500 },
    { id: "BK-003", room: "301", checkIn: "Feb 20, 2026", status: "completed", amount: 22500 },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case "upcoming":
        return <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">Upcoming</span>;
      case "confirmed":
        return <span className="px-2 py-1 text-xs rounded-full bg-green-500/10 text-green-600">Confirmed</span>;
      case "completed":
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-500/10 text-gray-600">Completed</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* VIP Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 to-amber-500/5 border border-amber-500/20 rounded-lg p-4 flex items-center gap-3">
        <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
        <div>
          <p className="text-sm font-medium text-foreground">VIP Member</p>
          <p className="text-xs text-muted-foreground">Thank you for being a loyal guest! Enjoy exclusive benefits.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-card border border-border-light rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Active Booking */}
      {activeBooking && (
        <div className="bg-card border border-border-light rounded-lg overflow-hidden">
          <div className="bg-primary/5 px-4 py-3 border-b border-border-light">
            <h2 className="text-sm font-semibold text-foreground">Active Booking</h2>
          </div>
          <div className="p-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex gap-4">
                <div className="w-20 h-20 bg-secondary rounded-lg overflow-hidden">
                  <img src={activeBooking.image} alt={activeBooking.roomType} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{activeBooking.roomType}</h3>
                  <p className="text-sm text-muted-foreground">Room {activeBooking.roomNumber}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs">
                    <span>📅 {activeBooking.checkIn}</span>
                    <span>→</span>
                    <span>📅 {activeBooking.checkOut}</span>
                    <span>• {activeBooking.nights} nights</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                {getStatusBadge(activeBooking.status)}
                <p className="text-lg font-bold text-foreground">KES {activeBooking.totalPrice.toLocaleString()}</p>
                <button className="text-sm text-primary hover:underline">View Details →</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Bookings */}
      <div className="bg-card border border-border-light rounded-lg">
        <div className="px-4 py-3 border-b border-border-light">
          <h2 className="text-sm font-semibold text-foreground">Recent Bookings</h2>
        </div>
        <div className="divide-y divide-border-light">
          {recentBookings.map((booking) => (
            <div key={booking.id} className="px-4 py-3 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-foreground">Booking #{booking.id}</p>
                <p className="text-xs text-muted-foreground">Room {booking.room} • {booking.checkIn}</p>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-sm font-medium text-foreground">KES {booking.amount.toLocaleString()}</p>
                {getStatusBadge(booking.status)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GuestDashboard;