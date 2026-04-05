import api from "../configs/api";


const roomService = {
  // public — fetch available rooms (guests)
  getRooms: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.type) params.append("type", filters.type);
    if (filters.status) params.append("status", filters.status);
    if (filters.floor) params.append("floor", filters.floor);
    const res = await api.get(`/rooms?${params.toString()}`);
    return res.data; // { rooms }
  },

  // public — single room
  getRoomById: async (id) => {
    const res = await api.get(`/rooms/${id}`);
    return res.data; // { room }
  },

  // admin — create room with image
  createRoom: async (formData) => {
    const res = await api.post("/rooms", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data; // { room }
  },

  // admin — update room with optional new image
  updateRoom: async (id, formData) => {
    const res = await api.put(`/rooms/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data; // { room }
  },

  // admin + receptionist — update status only
  updateRoomStatus: async (id, status) => {
    const res = await api.patch(`/rooms/${id}/status`, { status });
    return res.data; // { room }
  },

  // admin — delete room
  deleteRoom: async (id) => {
    const res = await api.delete(`/rooms/${id}`);
    return res.data;
  },
};

export default roomService;