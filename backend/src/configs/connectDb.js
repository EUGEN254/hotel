// configs/connectDB.js
import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";
import logger from "../utils/logger.js";

dotenv.config();

// Check if DATABASE_URL exists
if (!process.env.DATABASE_URL) {
  logger.error("DATABASE_URL is not defined in environment variables");
  process.exit(1);
}

// Initialize Neon with connection string
const sql = neon(process.env.DATABASE_URL);

// Test connection function
export const testConnection = async () => {
  try {
    const result = await sql`SELECT NOW()`;
    logger.db("Connected to Neon database successfully");
    logger.db(`Server time: ${result[0].now}`);
    return true;
  } catch (err) {
    logger.error("Database connection failed:", err.message);
    logger.error("Please check your DATABASE_URL in .env file");
    return false;
  }
};

// Export the sql instance
export default sql;
