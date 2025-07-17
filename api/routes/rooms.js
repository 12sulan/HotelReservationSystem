// routes/room.js
import express from "express";
import createError from "../utils/error.js";
import { verifyAdmin } from "../utils/verifyToken.js";
import {
  createRoom,
  updateRoom,
  deleteRoom,
  getRoom,
  getallRooms
} from "../controllers/room.js";

const router = express.Router();

// CREATE
router.post("/:hotelId", verifyAdmin, createRoom);

// UPDATE
router.put("/:id", verifyAdmin, updateRoom);

// DELETE
router.delete("/:id/:hotelId", verifyAdmin, deleteRoom);

// GET SINGLE
router.get("/:id", getRoom);

// GET ALL
router.get("/", getallRooms);

export default router;
