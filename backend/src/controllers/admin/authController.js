import bcrypt from "bcryptjs";
import { generateToken } from "../../utils/generateToken.js";
import { safeUser } from "../../utils/safeUser.js";
import sql from "../../configs/connectDb.js";
import logger from "../../utils/logger.js";


const cookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",       
  sameSite: process.env.NODE_ENV === "production"
    ? "none"   
    : "lax",   
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
});


// ── POST /api/auth/login ──
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required" });

    const rows = await sql`
      SELECT id, name, email, password, role, phone
      FROM users
      WHERE email = ${email}
      LIMIT 1
    `;

    // same message for wrong email and wrong password — don't reveal which
    if (!rows[0])
      return res.status(401).json({ message: "Invalid email or password" });

    const match = await bcrypt.compare(password, rows[0].password);
    if (!match)
      return res.status(401).json({ message: "Invalid email or password" });

    const token = generateToken(rows[0].id);

    res.cookie("token", token, cookieOptions());
    res.json({ user: safeUser(rows[0]) });
  } catch (err) {
    logger.error("Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
};

// ── GET /api/auth/me  (protected) ──
export const getMe = async (req, res) => {
  try {
    const rows = await sql`
      SELECT id, name, email, role, phone
      FROM users
      WHERE id = ${req.userId}
      LIMIT 1
    `;

    if (!rows[0])
      return res.status(404).json({ message: "User not found" });

    res.json({ user: safeUser(rows[0]) });
  } catch (err) {
    logger.error("GetMe error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ── POST /api/auth/logout ──
export const logout = (req, res) => {
  const { maxAge, ...clearOptions } = cookieOptions();
  res.clearCookie("token", clearOptions);
  res.json({ success: true, message: "Logged out successfully" });
};