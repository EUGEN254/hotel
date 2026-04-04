import api from "../../config/api";

const authService = {
  // register a new guest
  register: async ({ name, email, password }) => {
    const res = await api.post("/auth/register", { name, email, password });
    return res.data; //token,user
  },

  // login existing guest
  login: async ({ email, password }) => {
    const res = await api.post("/auth/login", { email, password });
    return res.data; //token,user
  },

  //get current logged in user(uses JWT from interceptos)
  getMe: async () => {
    const res = await api.get("/auth/me");
    return res.data; //user
  },

  logout: async () => {
    await api.post("/auth/logout"); 
  },
};

export default authService;
