import express from "express";
import {
    createBooking,
    updateBooking,
    deleteBooking,
    getBooking,
    getAllBookings,
    getUserBookings
} from "../controllers/booking.js";
import { verifyToken, verifyUser, verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();

// CREATE a booking (any logged-in user)
router.post("/", verifyToken, verifyUser, createBooking);

// UPDATE a booking (only admin)
router.put("/:id", verifyAdmin, updateBooking);

// DELETE a booking (only the user who booked or admin)
router.delete("/:id", verifyUser, deleteBooking);

// GET ONE booking (only the user who booked or admin)
router.get("/:id", verifyUser, getBooking);

// GET ALL bookings (only admin can see all)
router.get("/", verifyAdmin, getAllBookings);

// GET bookings of a specific user
router.get("/user/:userId", verifyUser, getUserBookings);

export default router;
