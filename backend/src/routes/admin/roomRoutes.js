import express from "express";
import {
  createRoom,
  deleteRoom,
  getRoomById,
  getRooms,
  updateRoom,
  updateRoomStatus,
} from "../../controllers/admin/roomController.js";
import { protect, requireRole } from "../../middleware/authMiddleware.js";
import { upload } from "../../middleware/uploadMiddleware.js";

const roomsRouter = express.Router();

// ── Public routes (no auth needed) ──
roomsRouter.get("/", getRooms);
roomsRouter.get("/:id", getRoomById);

// ── Admin only ──
roomsRouter.post(
  "/",
  protect,
  requireRole("admin"),
  upload.single("photo"),
  createRoom,
);

roomsRouter.put("/:id", protect, requireRole("admin"),upload.single("photo"), updateRoom);

roomsRouter.delete("/:id", protect, requireRole("admin"), deleteRoom);

// ── Admin + Receptionist ──
roomsRouter.patch(
  "/:id/status",
  protect,
  requireRole("admin", "receptionist"),
  updateRoomStatus,
);

export default roomsRouter;
