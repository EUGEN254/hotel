import { v2 as cloudinary } from "cloudinary";
import sql from "../../configs/connectDb.js";
import logger from "../../utils/logger.js";


// ── GET /api/rooms  (public) ──
// guests browse available rooms, admin sees all
export const getRooms = async (req, res) => {
  try {
    const { type, status, floor } = req.query;

    // base query — public guests only see available rooms
    // admin can pass ?status=all to see everything
    let rooms;

    if (type && floor) {
      rooms = await sql`
        SELECT id, room_number, type, floor, price_per_night, status, description, photo_url
        FROM rooms
        WHERE type = ${type} AND floor = ${parseInt(floor)}
        ORDER BY room_number ASC
      `;
    } else if (type) {
      rooms = await sql`
        SELECT id, room_number, type, floor, price_per_night, status, description, photo_url
        FROM rooms
        WHERE type = ${type}
        ORDER BY room_number ASC
      `;
    } else if (status && status !== "all") {
      rooms = await sql`
        SELECT id, room_number, type, floor, price_per_night, status, description, photo_url
        FROM rooms
        WHERE status = ${status}
        ORDER BY room_number ASC
      `;
    } else if (status === "all") {
      rooms = await sql`
        SELECT id, room_number, type, floor, price_per_night, status, description, photo_url
        FROM rooms
        ORDER BY room_number ASC
      `;
    } else {
      // default — only available rooms for guests
      rooms = await sql`
        SELECT id, room_number, type, floor, price_per_night, status, description, photo_url
        FROM rooms
        WHERE status = 'available'
        ORDER BY room_number ASC
      `;
    }

    res.json({ rooms });
  } catch (err) {
    logger.error("GetRooms error:", err);
    res.status(500).json({ message: "Server error fetching rooms" });
  }
};

// ── GET /api/rooms/:id  (public) ──
export const getRoomById = async (req, res) => {
  try {
    const { id } = req.params;

    const rows = await sql`
      SELECT id, room_number, type, floor, price_per_night, status, description, photo_url
      FROM rooms
      WHERE id = ${id}
      LIMIT 1
    `;

    if (!rows[0])
      return res.status(404).json({ message: "Room not found" });

    res.json({ room: rows[0] });
  } catch (err) {
    logger.error("GetRoomById error:", err);
    res.status(500).json({ message: "Server error fetching room" });
  }
};

// ── POST /api/rooms  (admin only) ──
export const createRoom = async (req, res) => {
  try {
    const { room_number, type, floor, price_per_night, description } = req.body;
    logger.info(`CreateRoom request: room_number=${room_number}, type=${type}, floor=${floor}, price_per_night=${price_per_night} by admin ${req.userId}`);

    if (!room_number || !type || !floor || !price_per_night)
      return res.status(400).json({ message: "Room number, type, floor, and price are required" });

    // check room number is unique
    const existing = await sql`
      SELECT id FROM rooms WHERE room_number = ${room_number} LIMIT 1
    `;
    if (existing.length > 0)
      return res.status(409).json({ message: `Room number ${room_number} already exists` });

    // photo_url comes from Cloudinary via Multer middleware
    const photo_url = req.file?.path || null;

    const rows = await sql`
      INSERT INTO rooms (room_number, type, floor, price_per_night, status, description, photo_url)
      VALUES (
        ${room_number},
        ${type},
        ${parseInt(floor)},
        ${parseFloat(price_per_night)},
        'available',
        ${description || null},
        ${photo_url}
      )
      RETURNING id, room_number, type, floor, price_per_night, status, description, photo_url
    `;

    logger.info(`Room created: ${room_number} by admin ${req.userId}`);
    res.status(201).json({ room: rows[0] });
  } catch (err) {
    logger.error("CreateRoom error:", err);
    res.status(500).json({ message: "Server error creating room" });
  }
};

// ── PUT /api/rooms/:id  (admin only) ──
export const updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const { room_number, type, floor, price_per_night, status, description } = req.body;

    // check room exists
    const existing = await sql`
      SELECT id, photo_url FROM rooms WHERE id = ${id} LIMIT 1
    `;
    if (!existing[0])
      return res.status(404).json({ message: "Room not found" });

    // if a new image was uploaded, use it — otherwise keep the existing one
    const photo_url = req.file?.path || existing[0].photo_url;

    // if new image uploaded and old one exists, delete old from Cloudinary
    if (req.file && existing[0].photo_url) {
      const publicId = existing[0].photo_url
        .split("/")
        .slice(-2)
        .join("/")
        .split(".")[0]; // extract public_id from URL
      await cloudinary.uploader.destroy(publicId);
    }

    const rows = await sql`
      UPDATE rooms
      SET
        room_number     = COALESCE(${room_number || null}, room_number),
        type            = COALESCE(${type || null}, type),
        floor           = COALESCE(${floor ? parseInt(floor) : null}, floor),
        price_per_night = COALESCE(${price_per_night ? parseFloat(price_per_night) : null}, price_per_night),
        status          = COALESCE(${status || null}, status),
        description     = COALESCE(${description || null}, description),
        photo_url       = ${photo_url}
      WHERE id = ${id}
      RETURNING id, room_number, type, floor, price_per_night, status, description, photo_url
    `;

    logger.info(`Room updated: ${id} by admin ${req.userId}`);
    res.json({ room: rows[0] });
  } catch (err) {
    logger.error("UpdateRoom error:", err);
    res.status(500).json({ message: "Server error updating room" });
  }
};

// ── PATCH /api/rooms/:id/status  (admin + receptionist) ──
// receptionist can update status only — not full room details
export const updateRoomStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["available", "occupied", "reserved", "maintenance", "dirty"];
    if (!validStatuses.includes(status))
      return res.status(400).json({ message: "Invalid status value" });

    const rows = await sql`
      UPDATE rooms
      SET status = ${status}
      WHERE id = ${id}
      RETURNING id, room_number, status
    `;

    if (!rows[0])
      return res.status(404).json({ message: "Room not found" });

    logger.info(`Room ${rows[0].room_number} status → ${status} by user ${req.userId}`);
    res.json({ room: rows[0] });
  } catch (err) {
    logger.error("UpdateRoomStatus error:", err);
    res.status(500).json({ message: "Server error updating room status" });
  }
};

// ── DELETE /api/rooms/:id  (admin only) ──
export const deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await sql`
      SELECT id, photo_url, room_number FROM rooms WHERE id = ${id} LIMIT 1
    `;
    if (!existing[0])
      return res.status(404).json({ message: "Room not found" });

    // delete image from Cloudinary if it exists
    if (existing[0].photo_url) {
      const publicId = existing[0].photo_url
        .split("/")
        .slice(-2)
        .join("/")
        .split(".")[0];
      await cloudinary.uploader.destroy(publicId);
    }

    await sql`DELETE FROM rooms WHERE id = ${id}`;

    logger.info(`Room deleted: ${existing[0].room_number} by admin ${req.userId}`);
    res.json({ message: `Room ${existing[0].room_number} deleted successfully` });
  } catch (err) {
    logger.error("DeleteRoom error:", err);
    res.status(500).json({ message: "Server error deleting room" });
  }
};