import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import "./myBookings.css";
import axios from "axios";

const MyBookings = () => {
    const { user } = useContext(AuthContext);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cancelId, setCancelId] = useState(null);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const { data } = await axios.get(
                    `http://localhost:8801/api/bookings/user/${user._id}`,
                    {
                        headers: { "Content-Type": "application/json" },
                        withCredentials: true
                    }
                );
                setBookings(data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };

        if (user) fetchBookings();
    }, [user]);

    const handleCancel = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:8801/api/bookings/${id}`, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true
            });
            if (response.status === 200) {
                setBookings(bookings.filter((b) => b._id !== id));
                setCancelId(null);
            } else {
                alert("Failed to cancel booking");
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className="loading">Loading your bookings...</div>;

    return (
        <div className="myBookingsContainer">
            <h1>My Bookings</h1>
            {bookings.length === 0 ? (
                <div className="noBookings">
                    <p className="emptyMessage">You don’t have any bookings yet.</p>
                    <Link to="/hotels" className="browseHotels">
                        Browse Hotels
                    </Link>
                </div>
            ) : (
                <div className="bookingList">
                    {bookings.map((booking) => (
                        <div key={booking._id} className="bookingCard">
                            <Link
                                to={`/hotels/${booking.hotelId}`}
                                className="bookingLink"
                            >
                                <h2>{booking.hotelName || "Hotel Name"}</h2>
                                <p>
                                    Check-in: {new Date(booking.checkInDate).toLocaleDateString()} <br />
                                    Check-out: {new Date(booking.checkOutDate).toLocaleDateString()} <br />
                                    Rooms: {booking.options?.room || 1}, Adults: {booking.options?.adult || 1}, Children: {booking.options?.children || 0}
                                </p>
                                <p className="totalPrice">Total Price: Rs {booking.amount}</p>
                            </Link>
                            <button
                                className="cancelButton"
                                onClick={() => setCancelId(booking._id)}
                            >
                                Cancel Booking
                            </button>

                            {cancelId === booking._id && (
                                <div className="cancelModal">
                                    <div className="modalContent">
                                        <p>Are you sure you want to cancel this booking?</p>
                                        <div className="modalButtons">
                                            <button
                                                className="confirmCancel"
                                                onClick={() => handleCancel(booking._id)}
                                            >
                                                Yes, Cancel
                                            </button>
                                            <button
                                                className="dismissCancel"
                                                onClick={() => setCancelId(null)}
                                            >
                                                No
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyBookings;
