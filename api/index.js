import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

import authRoute from "./routes/auth.js";
import usersRoute from "./routes/users.js";
import hotelsRoute from "./routes/hotels.js";
import roomsRoute from "./routes/rooms.js";
import bookingsRoute from "./routes/bookings.js";
import esewaRoute from "./routes/esewa.js";

import { errorHandler } from "./middlewares/errorHandler.js";
import cookieParser from "cookie-parser";
import subscribeRoute from "./routes/subscribe.js";
import cors from "cors";

dotenv.config();

const app = express();
const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range']
}));



const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("✅ MongoDB connected!");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("⚠️ MongoDB disconnected!");
});
mongoose.connection.on("connected", () => {
  console.log("🔌 MongoDB connection established.");
});

connect();

// Middleware
app.use(cookieParser());
app.use(express.json());

// logger
app.use((req, res, next) => {
  console.log(`[LOG] ${req.method} ${req.url}`);
  next();
});

//  Routes
app.use("/api/auth", authRoute);
app.use("/api/bookings", bookingsRoute);
app.use("/api/users", usersRoute);
app.use("/api/hotels", hotelsRoute);
app.use("/api/rooms", roomsRoute);
app.use("/api/subscribe", subscribeRoute);
app.use("/api/esewa", esewaRoute);






// Error handler
app.use(errorHandler);

//  Start Server
const PORT = process.env.PORT || 8801;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
