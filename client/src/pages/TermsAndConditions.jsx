import React from "react";
import "./pages.css";

const TermsAndConditions = () => {
    return (
        <div className="pageContainer">
            <h1>Terms & Conditions</h1>
            <p>
                By using LICTbookin services, you agree to the following terms and conditions:
            </p>
            <ul>
                <li>All bookings are subject to availability.</li>
                <li>Prices may change without prior notice.</li>
                <li>Cancellation policies apply per property.</li>
                <li>Users must provide accurate and up-to-date information.</li>
                <li>LICTbookin is not responsible for third-party services.</li>
            </ul>
            <p>
                For the full terms or any questions, please contact our{" "}
                <a href="/customer-service">Customer Service</a> team.
            </p>
        </div>
    );
};

export default TermsAndConditions;
