import api from "../../config/api";

const roomService = {
  // GET /api/rooms — only available rooms
  getRooms: async (params = {}) => {
    const res = await api.get("/rooms", { params });
    return res.data; // { rooms }
  },

  // GET /api/rooms/:id — view a single room before booking
  getRoomById: async (id) => {
    const res = await api.get(`/rooms/${id}`);
    return res.data; // { room }
  },
};

export default roomService;