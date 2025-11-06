import express from "express";
import { verifyToken } from "../utils/verifyToken.js";
import crypto from "crypto";

const router = express.Router();

// Test secret key provided by eSewa sandbox (replace with your own from merchant panel)
const ESEWA_SECRET_KEY = "8gBm/:&EnhH.1/q";
const ESEWA_PRODUCT_CODE = "EPAYTEST";

// eSewa v2 form URLs
const ESEWA_API_URL =
    process.env.NODE_ENV === "production"
        ? "https://epay.esewa.com.np/api/epay/main/v2/form"
        : "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

// ✅ Correct signature generator as per official eSewa docs
const generateSignature = (totalAmount, transactionUuid, productCode) => {
    // Format: total_amount=100,transaction_uuid=11-201-13,product_code=EPAYTEST
    const message = `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${productCode}`;

    // Compute HMAC-SHA256 and encode in base64
    return crypto
        .createHmac("sha256", ESEWA_SECRET_KEY)
        .update(message, "utf8")
        .digest("base64");
};

// ✅ Generate eSewa payment form payload
router.post("/generate", verifyToken, async (req, res) => {
    try {
        const { amount, bookingId } = req.body;

        if (!amount || !bookingId) {
            return res.status(400).json({
                success: false,
                message: "Amount and booking ID are required.",
            });
        }

        // Transaction UUID must be unique per request
        const transactionUuid = `${bookingId}-${Date.now()}`;
        const totalAmount = Math.floor(amount).toString();

        // Generate digital signature
        const signature = generateSignature(totalAmount, transactionUuid, ESEWA_PRODUCT_CODE);

        // Your frontend origin (update domain if deployed)
        const FRONTEND_URL =
            process.env.NODE_ENV === "production"
                ? "https://your-production-domain.com"
                : "http://localhost:5173";

        // Payload to be sent to eSewa form
        const esewaPayload = {
            amount: totalAmount,
            tax_amount: "0",
            total_amount: totalAmount,
            transaction_uuid: transactionUuid,
            product_code: ESEWA_PRODUCT_CODE,
            product_service_charge: "0",
            product_delivery_charge: "0",
            success_url: `${FRONTEND_URL}/payment/success`,
            failure_url: `${FRONTEND_URL}/payment/failure`,
            signed_field_names: "total_amount,transaction_uuid,product_code",
            signature,
        };

        // Send to frontend
        res.status(200).json({
            success: true,
            data: {
                paymentUrl: ESEWA_API_URL,
                formData: esewaPayload,
            },
        });
    } catch (error) {
        console.error("Error generating eSewa payload:", error);
        res.status(500).json({
            success: false,
            message: "Failed to generate eSewa payment payload.",
            error: error.message,
        });
    }
});

// ✅ Verify payment (optional but recommended)
router.get("/verify/:transactionUuid", verifyToken, async (req, res) => {
    try {
        const { transactionUuid } = req.params;
        const { total_amount } = req.query;

        const verifyURL =
            process.env.NODE_ENV === "production"
                ? "https://epay.esewa.com.np/api/epay/transaction/status/"
                : "https://rc.esewa.com.np/api/epay/transaction/status/";

        const response = await fetch(
            `${verifyURL}?product_code=${ESEWA_PRODUCT_CODE}&transaction_uuid=${transactionUuid}&total_amount=${total_amount}`
        );

        const data = await response.json();

        if (data.status === "COMPLETE") {
            return res.status(200).json({
                success: true,
                data: {
                    status: "COMPLETE",
                    refId: data.ref_id,
                },
            });
        }

        res.status(400).json({
            success: false,
            message: "Payment verification failed.",
            data: { status: data.status },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

export default router;
