import api from "../configs/api";

const authService = {
  // login existing guest
  login: async ({ email, password }) => {
    const res = await api.post("/admin/login", { email, password });
    return res.data;
  },

  getMe: async () => {
    const res = await api.get("/admin/me");
    return res.data; //user
  },

  logout: async () => {
    await api.post("/admin/logout");
  },
};

export default authService;
