import express from "express";
import { verifyToken } from "../utils/verifyToken.js";
import crypto from "crypto";

const router = express.Router();

// Secret key provided by eSewa for test environment
const ESEWA_SECRET_KEY = "8gBm/:&EnhH.1/q";
const ESEWA_PRODUCT_CODE = "EPAYTEST";
const ESEWA_API_URL = process.env.NODE_ENV === "production"
    ? "https://epay.esewa.com.np/api/epay/main/v2/form"
    : "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

const generateSignature = (totalAmount, transactionUuid, productCode) => {
    // Format as per eSewa docs: total_amount=100,transaction_uuid=11-201-13,product_code=EPAYTEST
    const message = `${totalAmount},${transactionUuid},${productCode}`;

    return crypto
        .createHmac('sha256', ESEWA_SECRET_KEY)
        .update(message)
        .digest('base64');
};

// Generate eSewa payment URL
router.post("/generate", verifyToken, async (req, res) => {
    try {
        const { amount, bookingId } = req.body;

        if (!amount || !bookingId) {
            return res.status(400).json({
                success: false,
                message: "Amount and booking ID are required"
            });
        }

        const transactionUuid = `${bookingId}-${Date.now()}`;
        const signature = generateSignature(amount, transactionUuid, ESEWA_PRODUCT_CODE);

        // Frontend origin URL for success/failure redirects
        const FRONTEND_URL = process.env.NODE_ENV === "production"
            ? "https://your-production-domain.com"
            : "http://localhost:5173";

        const totalAmount = Math.floor(amount).toString();

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
            signature: signature
        };

        res.status(200).json({
            success: true,
            data: {
                paymentUrl: ESEWA_API_URL,
                formData: esewaPayload
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Verify eSewa payment status
router.get("/verify/:transactionUuid", verifyToken, async (req, res) => {
    try {
        const { transactionUuid } = req.params;
        const { total_amount } = req.query;

        const verifyURL = process.env.NODE_ENV === "production"
            ? `https://epay.esewa.com.np/api/epay/transaction/status/`
            : `https://rc.esewa.com.np/api/epay/transaction/status/`;

        const response = await fetch(
            `${verifyURL}?product_code=${ESEWA_PRODUCT_CODE}&transaction_uuid=${transactionUuid}&total_amount=${total_amount}`
        );

        const data = await response.json();

        if (data.status === "COMPLETE") {
            return res.status(200).json({
                success: true,
                data: {
                    status: "COMPLETE",
                    refId: data.ref_id
                }
            });
        }

        res.status(400).json({
            success: false,
            message: "Payment verification failed",
            data: {
                status: data.status
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

export default router;