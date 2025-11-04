import React from "react";
import "./pages.css";

const CustomerService = () => {
    return (
        <div className="pageContainer">
            <h1>Customer Service</h1>
            <p>
                Welcome to our Customer Service page. If you have any questions, concerns, or need
                assistance with your booking, please contact us via email at{" "}
                <a href="mailto:support@lictbookin.com">support@lictbookin.com</a> or call +977-123456789.
            </p>
            <p>We are available Monday to Friday, 9 AM to 6 PM.</p>
            <p>
                Our team is dedicated to providing prompt and helpful assistance to ensure your
                travel experience is seamless and enjoyable.
            </p>
        </div>
    );
};

export default CustomerService;
