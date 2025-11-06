import Booking from "../models/Booking.js";
import Hotel from "../models/Hotel.js";

// Create a new booking (by a user)
export const createBooking = async (req, res, next) => {
    try {
        // Accept either client naming (startDate/endDate/total) or API model naming (checkInDate/checkOutDate/amount)
        const hotelId = req.body.hotelId || req.body.hotelID || req.body.hotel;
        const roomNumbers = req.body.roomNumbers || req.body.rooms || req.body.roomNumbers;
        const start = req.body.startDate || req.body.checkInDate || req.body.check_in_date;
        const end = req.body.endDate || req.body.checkOutDate || req.body.check_out_date;
        const total = req.body.total || req.body.amount || req.body.price;

        if (!hotelId || !roomNumbers || !start || !end || total === undefined) {
            return res.status(400).json({
                success: false,
                message: "Missing required booking information"
            });
        }

        // Map the incoming fields to the Booking model
        const bookingData = {
            userId: req.user?.id || req.user?._id,
            hotelId: hotelId,
            roomNumbers: Array.isArray(roomNumbers) ? roomNumbers : [roomNumbers],
            checkInDate: new Date(start),
            checkOutDate: new Date(end),
            amount: Number(total),
            status: req.body.status || "pending"
        };

        // Validate dates
        if (bookingData.checkInDate < bookingData.checkOutDate) {
            return res.status(400).json({
                success: false,
                message: "Check-out date must be after check-in date"
            });
        }

        const newBooking = new Booking(bookingData);
        const savedBooking = await newBooking.save();

        res.status(201).json(savedBooking);
    } catch (err) {
        console.error("Booking creation error:", err);
        if (err.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: "Invalid booking data",
                errors: Object.values(err.errors).map(e => e.message)
            });
        }
        next(err);
    }
};

// Update booking (admin only)
export const updateBooking = async (req, res, next) => {
    try {
        const updatedBooking = await Booking.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.status(200).json(updatedBooking);
    } catch (err) {
        next(err);
    }
};

// Delete booking (user or admin)
export const deleteBooking = async (req, res, next) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) return res.status(404).json({ message: "Booking not found" });

        // Only admin or the user who booked can delete
        if (req.user.isAdmin || req.user.id === booking.userId) {
            await Booking.findByIdAndDelete(req.params.id);
            res.status(200).json({ message: "Booking deleted" });
        } else {
            res.status(403).json({ message: "You can only delete your own bookings" });
        }
    } catch (err) {
        next(err);
    }
};

// Get a single booking (user or admin)
export const getBooking = async (req, res, next) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: "Booking not found" });

        // Only admin or the user who booked can view
        if (req.user.isAdmin || req.user.id === booking.userId) {
            res.status(200).json(booking);
        } else {
            res.status(403).json({ message: "You can only view your own bookings" });
        }
    } catch (err) {
        next(err);
    }
};

// Get all bookings (admin only)
export const getAllBookings = async (req, res, next) => {
    try {
        const bookings = await Booking.find()
            .populate('userId', 'username') // Populate user's name
            .populate('hotelId', 'name') // Populate hotel's name
            .lean() // Convert to plain JS object for better performance
            .exec();

        // Transform the response to include clear field names
        const formattedBookings = bookings.map(booking => ({
            ...booking,
            username: booking.userId?.username || "Unknown User",
            hotelName: booking.hotelId?.name || "Unknown Hotel",
            userId: booking.userId?._id, // Keep the original userId
            hotelId: booking.hotelId?._id // Keep the original hotelId
        }));

        res.status(200).json(formattedBookings);
    } catch (err) {
        next(err);
    }
};

// Optional: Get bookings by a user (frontend page)
export const getUserBookings = async (req, res, next) => {
    try {
        const bookings = await Booking.find({ userId: req.params.userId })
            .populate('hotelId', 'name') // Only populate the hotel name field
            .lean() // Convert to plain JS object for better performance
            .exec();

        // Transform the response to match the expected format
        const formattedBookings = bookings.map(booking => ({
            ...booking,
            hotelName: booking.hotelId?.name || "Unknown Hotel",
            hotelId: booking.hotelId?._id // Keep the original hotelId
        }));

        res.status(200).json(formattedBookings);
    } catch (err) {
        next(err);
    }
};
