import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import guestRouter from "./routes/guest/guestRoutes.js";
import { testConnection } from "./configs/connectDb.js";
import logger from "./utils/logger.js";

dotenv.config();

const app = express();

const isProduction = process.env.NODE_ENV === "production";
const allowedOrigins =
  (isProduction ? process.env.PROD_ORIGINS : process.env.DEV_ORIGINS)?.split(
    ",",
  ) || [];

app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(cors({ origin: allowedOrigins, credentials: true }));

// Health check
app.get("/", (req, res) => {
  res.json({
    status: "OK",
    environment: process.env.NODE_ENV || "development",
  });
});

// routes

app.use("/api/auth", guestRouter);

const PORT = process.env.PORT || 5000;

testConnection().then((connected) => {
  if (connected) {
    app.listen(PORT, () => {
      logger.line();
      logger.server(`Server running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV || "development"}`);
      logger.info(`Allowed origins: ${allowedOrigins.join(", ")}`);
      logger.line();
    });
  } else {
    logger.error("Failed to connect to database. Exiting...");
    process.exit(1);
  }
});
