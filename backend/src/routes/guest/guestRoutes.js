import express from "express";

import {
  getMe,
  login,
  register,
  logout,
} from "../../controllers/guest/guestController.js";
import { protect } from "../../middleware/authMiddleware.js";

const guestRouter = express.Router();

guestRouter.post("/register", register);
guestRouter.post("/login", login);
guestRouter.post("/logout", logout);
guestRouter.get("/me", protect, getMe);

export default guestRouter;
