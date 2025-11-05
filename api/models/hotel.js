import mongoose from "mongoose";

const HotelSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        type: {
            type: String,
            enum: ["Hotel", "Apartment", "Resort"],
            required: true,
        },
        city: { type: String, required: true },
        address: { type: String, required: true },
        distance: { type: String },
        photos: { type: [String] },
        title: { type: String },
        disrip: { type: String },
        rating: { type: Number, min: 0, max: 5 },
        rooms: { type: [String] },
        cheapestPrice: { type: Number, required: true },
        featured: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export default mongoose.model("Hotel", HotelSchema);
