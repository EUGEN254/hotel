import { useState } from "react";
import { Calendar, Clock, MapPin, MoreVertical, X, Edit, Trash2, ChevronDown, ChevronUp } from "lucide-react";

// Mock booking data - will be replaced with API data
const mockBookings = [
  {
    id: "BK-001",
    bookingRef: "SER-2026-001",
    room: { id: "205", name: "Room 205", type: "double", floor: 2 },
    checkIn: "2026-04-10",
    checkOut: "2026-04-13",
    nights: 3,
    guests: 2,
    totalPrice: 12000,
    status: "confirmed",
    paymentStatus: "paid",
    createdAt: "2026-03-01",
    specialRequests: "Extra pillows please",
  },
  {
    id: "BK-002",
    bookingRef: "SER-2026-002",
    room: { id: "101", name: "Room 101", type: "single", floor: 1 },
    checkIn: "2026-05-15",
    checkOut: "2026-05-17",
    nights: 2,
    guests: 1,
    totalPrice: 5000,
    status: "confirmed",
    paymentStatus: "pending",
    createdAt: "2026-03-15",
    specialRequests: "",
  },
  {
    id: "BK-003",
    bookingRef: "SER-2026-003",
    room: { id: "301", name: "Room 301", type: "suite", floor: 3 },
    checkIn: "2026-03-20",
    checkOut: "2026-03-22",
    nights: 2,
    guests: 2,
    totalPrice: 15000,
    status: "completed",
    paymentStatus: "paid",
    createdAt: "2026-02-20",
    specialRequests: "Late check-out requested",
  },
  {
    id: "BK-004",
    bookingRef: "SER-2026-004",
    room: { id: "102", name: "Room 102", type: "single", floor: 1 },
    checkIn: "2026-02-10",
    checkOut: "2026-02-12",
    nights: 2,
    guests: 1,
    totalPrice: 5000,
    status: "cancelled",
    paymentStatus: "refunded",
    createdAt: "2026-01-15",
    specialRequests: "",
  },
];

const statusConfig = {
  confirmed: { label: "Confirmed", color: "bg-green-500/10 text-green-600", border: "border-green-500/20" },
  pending: { label: "Pending", color: "bg-yellow-500/10 text-yellow-600", border: "border-yellow-500/20" },
  completed: { label: "Completed", color: "bg-blue-500/10 text-blue-600", border: "border-blue-500/20" },
  cancelled: { label: "Cancelled", color: "bg-red-500/10 text-red-600", border: "border-red-500/20" },
  "checked-in": { label: "Checked In", color: "bg-purple-500/10 text-purple-600", border: "border-purple-500/20" },
  "checked-out": { label: "Checked Out", color: "bg-gray-500/10 text-gray-600", border: "border-gray-500/20" },
};

const paymentStatusConfig = {
  paid: { label: "Paid", color: "text-green-600" },
  pending: { label: "Pending", color: "text-yellow-600" },
  refunded: { label: "Refunded", color: "text-gray-500" },
  partial: { label: "Partial", color: "text-orange-600" },
};

const GuestBookings = () => {
  const [bookings, setBookings] = useState(mockBookings);
  const [filter, setFilter] = useState("all"); // all, upcoming, past, cancelled
  const [expandedBooking, setExpandedBooking] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(null);
  const [showModifyModal, setShowModifyModal] = useState(null);

  const today = new Date().toISOString().split("T")[0];

  // Filter bookings based on selected filter
  const getFilteredBookings = () => {
    switch (filter) {
      case "upcoming":
        return bookings.filter(b => b.checkIn >= today && b.status !== "cancelled" && b.status !== "completed");
      case "past":
        return bookings.filter(b => b.checkOut < today || b.status === "completed");
      case "cancelled":
        return bookings.filter(b => b.status === "cancelled");
      default:
        return bookings;
    }
  };

  const filteredBookings = getFilteredBookings();

  // Check if booking can be modified or cancelled (only before check-in)
  const canModify = (booking) => {
    return booking.checkIn > today && booking.status !== "cancelled" && booking.status !== "completed";
  };

  // Handle cancel booking
  const handleCancelBooking = (bookingId) => {
    setBookings(bookings.map(booking =>
      booking.id === bookingId
        ? { ...booking, status: "cancelled", paymentStatus: "refunded" }
        : booking
    ));
    setShowCancelModal(null);
    // In production: API call to cancel booking
    console.log("Booking cancelled:", bookingId);
  };

  // Toggle expanded view for booking details
  const toggleExpand = (bookingId) => {
    setExpandedBooking(expandedBooking === bookingId ? null : bookingId);
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">My Bookings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          View, manage, and track all your reservations
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-border-light">
        {[
          { id: "all", label: "All Bookings" },
          { id: "upcoming", label: "Upcoming" },
          { id: "past", label: "Past" },
          { id: "cancelled", label: "Cancelled" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-4 py-2 text-sm font-medium transition-colors relative
              ${filter === tab.id
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
              }`}
          >
            {tab.label}
            {tab.id === "upcoming" && (
              <span className="ml-2 px-1.5 py-0.5 text-xs rounded-full bg-primary/10 text-primary">
                {bookings.filter(b => b.checkIn >= today && b.status !== "cancelled" && b.status !== "completed").length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.length === 0 ? (
          <div className="text-center py-12 bg-card border border-border-light rounded-lg">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No bookings found</p>
            <a
              href="/guest/browse-rooms"
              className="inline-block mt-3 text-sm text-primary hover:underline"
            >
              Browse rooms to make a booking →
            </a>
          </div>
        ) : (
          filteredBookings.map((booking) => {
            const status = statusConfig[booking.status] || statusConfig.confirmed;
            const paymentStatus = paymentStatusConfig[booking.paymentStatus] || paymentStatusConfig.pending;
            const isExpanded = expandedBooking === booking.id;

            return (
              <div
                key={booking.id}
                className={`bg-card border ${status.border} rounded-lg overflow-hidden transition-all`}
              >
                {/* Booking Header */}
                <div className="p-4 cursor-pointer" onClick={() => toggleExpand(booking.id)}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-foreground">
                          {booking.room.name} - {booking.room.type.charAt(0).toUpperCase() + booking.room.type.slice(1)} Room
                        </span>
                        <span className={`px-2 py-0.5 text-xs rounded-full ${status.color}`}>
                          {status.label}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(booking.checkIn)} → {formatDate(booking.checkOut)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {booking.nights} nights
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          Floor {booking.room.floor}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-lg font-bold text-foreground">
                          KES {booking.totalPrice.toLocaleString()}
                        </p>
                        <p className={`text-xs ${paymentStatus.color}`}>
                          {paymentStatus.label}
                        </p>
                      </div>
                      <button className="p-1 hover:bg-secondary rounded">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-border-light p-4 bg-secondary/20">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                          Booking Details
                        </h4>
                        <div className="space-y-1 text-sm">
                          <p><span className="text-muted-foreground">Reference:</span> {booking.bookingRef}</p>
                          <p><span className="text-muted-foreground">Guests:</span> {booking.guests} adult(s)</p>
                          <p><span className="text-muted-foreground">Booked on:</span> {formatDate(booking.createdAt)}</p>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                          Payment Breakdown
                        </h4>
                        <div className="space-y-1 text-sm">
                          <p><span className="text-muted-foreground">Room rate:</span> KES {booking.totalPrice.toLocaleString()}</p>
                          <p><span className="text-muted-foreground">Taxes & fees:</span> Included</p>
                          <p className="font-medium"><span className="text-muted-foreground">Total:</span> KES {booking.totalPrice.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>

                    {booking.specialRequests && (
                      <div className="mb-4 p-3 bg-card rounded-lg border border-border-light">
                        <p className="text-xs text-muted-foreground mb-1">Special Requests</p>
                        <p className="text-sm text-foreground">{booking.specialRequests}</p>
                      </div>
                    )}

                    {/* Action Buttons - Only show if can modify */}
                    {canModify(booking) && (
                      <div className="flex gap-3 pt-2">
                        <button
                          onClick={() => setShowModifyModal(booking)}
                          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary/10 transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          Modify Booking
                        </button>
                        <button
                          onClick={() => setShowCancelModal(booking)}
                          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-destructive border border-destructive/30 rounded-lg hover:bg-destructive/10 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Cancel Booking
                        </button>
                      </div>
                    )}

                    {booking.status === "completed" && (
                      <div className="flex gap-3 pt-2">
                        <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary/10 transition-colors">
                          View Invoice
                        </button>
                        <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-muted-foreground border border-border rounded-lg hover:bg-secondary transition-colors">
                          Write a Review
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg max-w-md w-full mx-4 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-foreground">Cancel Booking</h3>
              <button onClick={() => setShowCancelModal(null)} className="p-1 hover:bg-secondary rounded">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-muted-foreground mb-2">
              Are you sure you want to cancel your booking for <strong>{showCancelModal.room.name}</strong>?
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              Check-in: {formatDate(showCancelModal.checkIn)} - {formatDate(showCancelModal.checkOut)}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(null)}
                className="flex-1 px-4 py-2 border border-border rounded-lg text-foreground hover:bg-secondary"
              >
                Keep Booking
              </button>
              <button
                onClick={() => handleCancelBooking(showCancelModal.id)}
                className="flex-1 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modify Modal Placeholder */}
      {showModifyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg max-w-md w-full mx-4 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-foreground">Modify Booking</h3>
              <button onClick={() => setShowModifyModal(null)} className="p-1 hover:bg-secondary rounded">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-muted-foreground mb-6">
              Modify functionality coming soon. Please contact reception for changes to your booking.
            </p>
            <button
              onClick={() => setShowModifyModal(null)}
              className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuestBookings;