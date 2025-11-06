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
import Booking from "../models/Booking.js";

const router = express.Router();

// CREATE a booking (any logged-in user)
router.post("/", verifyToken, createBooking);

// UPDATE a booking (only admin)
router.put("/:id", verifyAdmin, updateBooking);

// DELETE a booking (only the user who booked or admin)
router.delete("/:id", verifyToken, deleteBooking);

// GET ONE booking (only the user who booked or admin)
router.get("/:id", verifyToken, getBooking);

// GET ALL bookings (only admin can see all)
router.get("/", verifyAdmin, getAllBookings);

// GET bookings of a specific user
router.get("/user/:userId", verifyToken, getUserBookings);

// ✅ NEW: Update booking status (for payment confirmation)
router.put("/:id/status", verifyToken, async (req, res) => {
    try {
        const { status } = req.body;
        const updatedBooking = await Booking.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!updatedBooking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Booking status updated successfully",
            data: updatedBooking,
        });
    } catch (error) {
        console.error("Error updating booking status:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update booking status",
            error: error.message,
        });
    }
});

export default router;
