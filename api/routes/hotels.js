import express from "express";
import { verifyAdmin } from "../utils/verifyToken.js";
import {
      countByCity,
      countByType,
      createHotel,
      deleteHotel,
      getallHotel,
      getHotel,
      getHotelRooms,
      updateHotel,
} from "../controllers/hotel.js";

const router = express.Router();

// CREATE
router.post("/", verifyAdmin, createHotel);

// UPDATE
router.put("/:id", verifyAdmin, updateHotel);

// DELETE
router.delete("/:id", verifyAdmin, deleteHotel);

// GET ONE
router.get("/find/:id", getHotel);

// GET ALL
router.get("/", getallHotel);

// COUNT BY CITY
router.get("/countByCity", countByCity);

// COUNT BY TYPE
router.get("/countByType", countByType);

// GET HOTEL ROOMS
router.get("/room/:id", getHotelRooms);

export default router;
