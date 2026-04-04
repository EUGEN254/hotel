import jwt from "jsonwebtoken";
import logger from "../utils/logger.js";
import sql from "../configs/connectDb.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    // get token
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    } else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // no token
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;

    const rows =
      await sql`SELECT role FROM users WHERE id = ${decoded.id} LIMIT 1`;
    if (!rows[0]) return res.status(401).json({ message: "User not found" });
    req.userRole = rows[0].role;

    next();
  } catch (error) {
    logger.error("Auth middleware error:", error);
    return res.status(401).json({
      success: false,
      message: "Not authorized, token failed",
    });
  }
};
