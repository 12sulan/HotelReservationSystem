import Booking from "../models/Booking.js";
import Hotel from "../models/Hotel.js";

// Create a new booking (by a user)
export const createBooking = async (req, res, next) => {
    // Map the incoming fields to the correct model fields
    const bookingData = {
        userId: req.user.id,
        hotelId: req.body.hotelId,
        roomNumbers: Array.isArray(req.body.roomNumbers) ? req.body.roomNumbers.map(num => parseInt(num)) : [],
        checkInDate: req.body.startDate,
        checkOutDate: req.body.endDate,
        amount: req.body.total,
    };

    const newBooking = new Booking(bookingData);

    try {
        const savedBooking = await newBooking.save();

        // Optional: Update booked rooms in Hotel model if needed
        if (req.body.roomNumbers && req.body.hotelId) {
            await Hotel.updateOne(
                { _id: req.body.hotelId, "rooms.number": { $in: req.body.roomNumbers } },
                { $set: { "rooms.$[].unavailableDates": req.body.checkInDate } } // customize if you track booked dates
            );
        }

        res.status(201).json(savedBooking);
    } catch (err) {
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
