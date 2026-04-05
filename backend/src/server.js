import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import guestRouter from "./routes/guest/guestRoutes.js";
import { testConnection } from "./configs/connectDb.js";
import logger from "./utils/logger.js";
import roomsRouter from "./routes/admin/roomRoutes.js";
import adminRouter from "./routes/admin/authRoutes.js";

dotenv.config();

const app = express();

const isProduction = process.env.NODE_ENV === "production";

const allowedOrigins = (
  isProduction ? process.env.PROD_ORIGINS : process.env.DEV_ORIGINS
)
  ?.split(",")
  .map((o) => o.trim()) || [];

app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));


app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        logger.error(`CORS blocked: ${origin}`);
        callback(new Error(`CORS policy blocked: ${origin}`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Health check
app.get("/", (req, res) => {
  res.json({
    status: "OK",
    environment: process.env.NODE_ENV || "development",
  });
});

// Routes
app.use("/api/auth", guestRouter);
app.use("/api/admin", adminRouter);
app.use("/api/rooms", roomsRouter);

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