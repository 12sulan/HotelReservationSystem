import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './payment.css';

const PaymentSuccess = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const verifyPayment = async () => {
            try {
                // Get the encoded data from URL
                const params = new URLSearchParams(location.search);
                const data = JSON.parse(atob(params.get('data')));

                // Get the base64 encoded data from URL and decode it
                const base64Data = params.get('data');
                if (!base64Data) {
                    throw new Error('No payment data received');
                }

                const decodedData = JSON.parse(atob(base64Data));

                // Verify signature from eSewa
                const {
                    transaction_code,
                    status,
                    total_amount,
                    transaction_uuid,
                    product_code,
                    signature
                } = decodedData;

                // Verify payment with backend
                const response = await axios.get(
                    `http://localhost:8801/api/esewa/verify/${transaction_uuid}?total_amount=${total_amount}`,
                    { withCredentials: true }
                ); if (response.data.success) {
                    // Payment was successful, update room availability
                    const bookingId = data.transaction_uuid.split('-')[0];
                    await axios.put(
                        `http://localhost:8801/api/bookings/${bookingId}/status`,
                        { status: 'confirmed' },
                        { withCredentials: true }
                    );

                    setLoading(false);
                }
            } catch (err) {
                setError('Payment verification failed. Please contact support.');
                setLoading(false);
            }
        };

        verifyPayment();
    }, [location]);

    if (loading) {
        return (
            <div className="payment-result">
                <div className="loader">
                    <div className="spinner"></div>
                    <p>Verifying your payment...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="payment-result error">
                <div className="icon">❌</div>
                <h1>Payment Verification Failed</h1>
                <p>{error}</p>
                <button onClick={() => navigate('/my-bookings')}>View My Bookings</button>
            </div>
        );
    }

    return (
        <div className="payment-result success">
            <div className="icon">✅</div>
            <h1>Payment Successful!</h1>
            <p>Your booking has been confirmed.</p>
            <div className="buttons">
                <button onClick={() => navigate('/my-bookings')}>View My Bookings</button>
                <button onClick={() => navigate('/')} className="secondary">
                    Back to Home
                </button>
            </div>
        </div>
    );
};

export default PaymentSuccess;