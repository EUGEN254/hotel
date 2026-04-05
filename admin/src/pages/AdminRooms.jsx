import { useState } from "react";
import { toast } from "../components/ui/toaster";
import roomService from "../services/roomService";
import useRooms from "../hooks/useRooms";


const ROOM_TYPES = ["single", "double", "suite"];
const ROOM_STATUSES = ["available", "occupied", "reserved", "maintenance", "dirty"];

const statusColors = {
  available:   "bg-green-100 text-green-800",
  occupied:    "bg-red-100 text-red-800",
  reserved:    "bg-purple-100 text-purple-800",
  maintenance: "bg-gray-100 text-gray-700",
  dirty:       "bg-amber-100 text-amber-800",
};

const emptyForm = {
  room_number: "",
  type: "single",
  floor: "",
  price_per_night: "",
  status: "available",
  description: "",
  photo: null,
};

export default function AdminRooms() {
  const { rooms, loading, error, refetch } = useRooms({ status: "all" });

  const [showModal, setShowModal]   = useState(false);
  const [editRoom, setEditRoom]     = useState(null);
  const [form, setForm]             = useState(emptyForm);
  const [preview, setPreview]       = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteId, setDeleteId]     = useState(null);

  // ── helpers ──
  const openAdd = () => {
    setEditRoom(null);
    setForm(emptyForm);
    setPreview(null);
    setShowModal(true);
  };

  const openEdit = (room) => {
    setEditRoom(room);
    setForm({
      room_number:     room.room_number,
      type:            room.type,
      floor:           room.floor,
      price_per_night: room.price_per_night,
      status:          room.status,
      description:     room.description || "",
      photo:           null,
    });
    setPreview(room.photo_url || null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditRoom(null);
    setForm(emptyForm);
    setPreview(null);
  };

  const handleChange = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm((f) => ({ ...f, photo: file }));
    setPreview(URL.createObjectURL(file));
  };

  const removePhoto = () => {
    setPreview(null);
    setForm((f) => ({ ...f, photo: null }));
  };

  // ── submit add / edit ──
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("room_number",     form.room_number);
      fd.append("type",            form.type);
      fd.append("floor",           form.floor);
      fd.append("price_per_night", form.price_per_night);
      fd.append("status",          form.status);
      fd.append("description",     form.description);
      if (form.photo) fd.append("photo", form.photo);

      if (editRoom) {
        await roomService.updateRoom(editRoom.id, fd);
        toast.success("Room updated successfully");
      } else {
        await roomService.createRoom(fd);
        toast.success("Room added successfully");
      }

      closeModal();
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save room");
    } finally {
      setSubmitting(false);
    }
  };

  // ── delete ──
  const handleDelete = async () => {
    try {
      await roomService.deleteRoom(deleteId);
      toast.success("Room deleted");
      setDeleteId(null);
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete room");
    }
  };

  // ── render ──
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Top bar */}
      <div className="bg-white border-b border-border px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-base font-semibold text-foreground">
            Room management
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {rooms.length} rooms total
          </p>
        </div>
        <button
          onClick={openAdd}
          className="bg-[#0F3D30] text-[#C9A84C] text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#1A5C42] transition-colors"
        >
          + Add room
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-auto">
        {/* Stats */}
        <div className="grid grid-cols-5 gap-3 mb-6">
          {ROOM_STATUSES.map((s) => (
            <div
              key={s}
              className="bg-white rounded-lg border border-border p-3"
            >
              <div className="text-xs text-muted-foreground capitalize mb-1">
                {s}
              </div>
              <div className="text-xl font-semibold text-foreground">
                {rooms.filter((r) => r.status === s).length}
              </div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-muted-foreground text-sm">
              Loading rooms...
            </div>
          ) : error ? (
            <div className="p-12 text-center text-red-500 text-sm">{error}</div>
          ) : rooms.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground text-sm">
              No rooms yet.{" "}
              <button
                onClick={openAdd}
                className="text-primary hover:underline"
              >
                Add your first room
              </button>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  {["Photo", "Room", "Type", "Floor", "Price / night", "Status", "Actions"].map(
                    (h) => (
                      <th
                        key={h}
                        className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rooms.map((room) => (
                  <tr
                    key={room.id}
                    className="hover:bg-muted/20 transition-colors"
                  >
                    <td className="px-4 py-3">
                      {room.photo_url ? (
                        <img
                          src={room.photo_url}
                          alt={`Room ${room.room_number}`}
                          className="w-12 h-10 object-cover rounded-md border border-border"
                        />
                      ) : (
                        <div className="w-12 h-10 rounded-md bg-muted flex items-center justify-center text-muted-foreground text-xs">
                          No img
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground">
                      {room.room_number}
                    </td>
                    <td className="px-4 py-3 capitalize text-foreground">
                      {room.type}
                    </td>
                    <td className="px-4 py-3 text-foreground">{room.floor}</td>
                    <td className="px-4 py-3 text-foreground">
                      KES {Number(room.price_per_night).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${
                          statusColors[room.status]
                        }`}
                      >
                        {room.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 flex items-center gap-2">
                      <button
                        onClick={() => openEdit(room)}
                        className="text-xs px-3 py-1.5 border border-border rounded-md hover:bg-muted transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteId(room.id)}
                        className="text-xs px-3 py-1.5 border border-red-200 text-red-600 rounded-md hover:bg-red-50 transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ── Add / Edit Modal ── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Modal header */}
            <div className="px-6 py-4 border-b border-border flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="font-semibold text-foreground">
                {editRoom
                  ? `Edit room ${editRoom.room_number}`
                  : "Add new room"}
              </h2>
              <button
                onClick={closeModal}
                className="text-muted-foreground hover:text-foreground text-2xl leading-none"
              >
                ×
              </button>
            </div>

            {/* Modal form */}
            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              {/* Photo upload */}
              <div>
                <label className="block text-xs font-medium text-foreground mb-2 uppercase tracking-wide">
                  Room photo
                </label>
                <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                  {preview ? (
                    <div>
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-40 object-cover rounded-lg mb-2"
                      />
                      <button
                        type="button"
                        onClick={removePhoto}
                        className="text-xs text-red-500 hover:underline"
                      >
                        Remove photo
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer block">
                      <div className="text-muted-foreground text-sm mb-1">
                        Click to upload photo
                      </div>
                      <div className="text-xs text-muted-foreground">
                        JPG, PNG, WEBP — max 5MB
                      </div>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handlePhotoChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Room number + Type */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5 uppercase tracking-wide">
                    Room number *
                  </label>
                  <input
                    type="text"
                    value={form.room_number}
                    onChange={handleChange("room_number")}
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g. 101"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5 uppercase tracking-wide">
                    Type *
                  </label>
                  <select
                    value={form.type}
                    onChange={handleChange("type")}
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {ROOM_TYPES.map((t) => (
                      <option key={t} value={t} className="capitalize">
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Floor + Price */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5 uppercase tracking-wide">
                    Floor *
                  </label>
                  <input
                    type="number"
                    value={form.floor}
                    onChange={handleChange("floor")}
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="1"
                    min="1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5 uppercase tracking-wide">
                    Price / night (KES) *
                  </label>
                  <input
                    type="number"
                    value={form.price_per_night}
                    onChange={handleChange("price_per_night")}
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="2500"
                    min="0"
                    required
                  />
                </div>
              </div>

              {/* Status — show on edit only */}
              {editRoom && (
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5 uppercase tracking-wide">
                    Status
                  </label>
                  <select
                    value={form.status}
                    onChange={handleChange("status")}
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {ROOM_STATUSES.map((s) => (
                      <option key={s} value={s} className="capitalize">
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Description */}
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5 uppercase tracking-wide">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={handleChange("description")}
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  rows={3}
                  placeholder="Short description of the room..."
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2.5 border border-border rounded-lg text-sm text-foreground hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2.5 bg-[#0F3D30] text-[#C9A84C] rounded-lg text-sm font-medium hover:bg-[#1A5C42] transition-colors disabled:opacity-60"
                >
                  {submitting
                    ? "Saving..."
                    : editRoom
                    ? "Save changes"
                    : "Add room"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete confirmation ── */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-sm p-6">
            <h3 className="font-semibold text-foreground mb-2">Delete room?</h3>
            <p className="text-sm text-muted-foreground mb-6">
              This will permanently delete the room and its photo. This cannot
              be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 px-4 py-2 border border-border rounded-lg text-sm hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}