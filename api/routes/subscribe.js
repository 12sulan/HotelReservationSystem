import express from "express";
import Subscription from "../models/Subscription.js";

const router = express.Router();

router.post("/", async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    try {
        const existing = await Subscription.findOne({ email });
        if (existing)
            return res.status(400).json({ message: "Email already subscribed" });

        const newSub = new Subscription({ email });
        await newSub.save();

        res.status(201).json({ message: "Subscribed successfully!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
