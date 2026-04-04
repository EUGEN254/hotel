import jwt from "jsonwebtoken";
import sql from "../configs/connectDb.js";
import logger from "../utils/logger.js";

// ── protect ──
// Verifies the httpOnly cookie token and attaches userId + userRole to req
export const protect = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    logger.info(`Auth middleware — token: ${token ? "found" : "not found"}`);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized — please log in",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;

    // fetch role from DB so requireRole() guards work correctly
    const rows = await sql`
      SELECT role FROM users WHERE id = ${decoded.id} LIMIT 1
    `;

    if (!rows[0]) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists",
      });
    }

    req.userRole = rows[0].role;
    next();
  } catch (error) {
    logger.error("Auth middleware error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Not authorized — token invalid or expired",
    });
  }
};

// ── requireRole ──
// Use after protect() to restrict routes by role
// e.g. router.delete('/room/:id', protect, requireRole('admin'), handler)
export const requireRole =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.userRole)) {
      return res.status(403).json({
        success: false,
        message: "Access denied — insufficient permissions",
      });
    }
    next();
  };
