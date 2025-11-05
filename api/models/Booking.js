import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        hotelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
        roomNumbers: [{ type: Number, required: true }],
        checkInDate: { type: Date, required: true },
        checkOutDate: { type: Date, required: true },
        amount: { type: Number, required: true },
        status: { type: String, default: "booked" },
    },
    { timestamps: true }
);

export default mongoose.model("Booking", BookingSchema);
