import { useNavigate } from 'react-router-dom';
import './payment.css';

const PaymentFailure = () => {
    const navigate = useNavigate();

    return (
        <div className="payment-result error">
            <div className="icon">❌</div>
            <h1>Payment Failed</h1>
            <p>Your payment was not successful. Please try again.</p>
            <div className="buttons">
                <button onClick={() => navigate('/my-bookings')}>View My Bookings</button>
                <button onClick={() => navigate('/')} className="secondary">
                    Back to Home
                </button>
            </div>
        </div>
    );
};

export default PaymentFailure;