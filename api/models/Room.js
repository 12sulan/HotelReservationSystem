import mongoose from 'mongoose';

const RoomSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true,
        },
        price: {
            type: Number,
            required: true,
        },
        maxpeople: {
            type: Number,
            default: false,
        },
        discrip: {
            type: String,
            required: true,
        },
        roomNumbers: [
            {
                number: Number,
                unavailableDates: [{ type: Date }]
            }
        ],
    },
    { timestamps: true }
);

export default mongoose.model("Room", RoomSchema);  
