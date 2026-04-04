import bcrypt from "bcryptjs";
import { generateToken } from "../../utils/generateToken.js";
import { safeUser } from "../../utils/safeUser.js";
import sql from "../../configs/connectDb.js";

// ── POST /api/auth/register ──
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    if (password.length < 6)
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });

    const existing = await sql`
      SELECT id FROM users WHERE email = ${email} LIMIT 1
    `;
    if (existing.length > 0)
      return res.status(409).json({ message: "Email already in use" });

    const hashed = await bcrypt.hash(password, 10);

    const rows = await sql`
      INSERT INTO users (name, email, password, role)
      VALUES (${name}, ${email}, ${hashed}, 'guest')
      RETURNING id, name, email, role, phone
    `;

    const token = generateToken(rows[0].id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({ user: safeUser(rows[0]) });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error during registration" });
  }
};

// ── POST /api/auth/login ──
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Email and password are required" });

    const rows = await sql`
      SELECT id, name, email, password, role, phone
      FROM users
      WHERE email = ${email}
      LIMIT 1
    `;

    if (!rows[0])
      return res.status(401).json({ message: "Invalid email or password" });

    const match = await bcrypt.compare(password, rows[0].password);
    if (!match)
      return res.status(401).json({ message: "Invalid email or password" });

    const token = generateToken(rows[0].id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ user: safeUser(rows[0]) });
  } catch (err) {
    console.error("Login error:", err);
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

    if (!rows[0]) return res.status(404).json({ message: "User not found" });

    res.json({ user: safeUser(rows[0]) });
  } catch (err) {
    console.error("GetMe error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ── POST /api/auth/logout ──
export const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  res.json({ success: true, message: "Logged out successfully" });
};
