import express from "express";
import { protect } from "../../middleware/authMiddleware.js";
import {
  getMe,
  login,
  logout,
} from "../../controllers/admin/authController.js";

const adminRouter = express.Router();

adminRouter.post("/login", login);
adminRouter.post("/logout", logout);
adminRouter.get("/me", protect, getMe);

export default adminRouter;
