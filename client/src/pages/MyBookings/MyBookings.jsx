import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import "./myBookings.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faHotel,
    faCalendarDays,
    faMoneyBill,
    faSpinner,
    faSuitcase,
    faExclamationTriangle,
    faCalendarCheck,
    faCalendarXmark,
    faUsers
} from "@fortawesome/free-solid-svg-icons";
import Navbar from "../../components/navbar/Navbar";

const MyBookings = () => {
    const { user } = useContext(AuthContext);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [filter, setFilter] = useState("all");

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

    const handleCancelClick = (booking) => {
        setSelectedBooking(booking);
        setShowCancelModal(true);
    };

    const handleConfirmCancel = async () => {
        if (!selectedBooking) return;

        try {
            await axios.delete(
                `http://localhost:8801/api/bookings/${selectedBooking._id}`,
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true
                }
            );
            setBookings(bookings.filter((b) => b._id !== selectedBooking._id));
            setShowCancelModal(false);
            setSelectedBooking(null);
        } catch (error) {
            console.error("Error cancelling booking:", error);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const filteredBookings = bookings.filter((booking) => {
        if (filter === "all") return true;
        const now = new Date();
        const checkInDate = new Date(booking.checkInDate);
        return filter === "upcoming"
            ? checkInDate > now
            : checkInDate <= now;
    });

    const getBookingStatus = (booking) => {
        const now = new Date();
        const checkInDate = new Date(booking.checkInDate);
        return checkInDate > now ? "upcoming" : "past";
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="loadingState">
                    <FontAwesomeIcon icon={faSpinner} spin />
                    <p>Loading your bookings...</p>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="myBookingsContainer">
                <div className="bookingsHeader">
                    <h1>My Bookings</h1>
                    <div className="filterButtons">
                        <button
                            className={`filterBtn ${filter === "all" ? "active" : ""}`}
                            onClick={() => setFilter("all")}
                        >
                            All Bookings
                        </button>
                        <button
                            className={`filterBtn ${filter === "upcoming" ? "active" : ""}`}
                            onClick={() => setFilter("upcoming")}
                        >
                            Upcoming
                        </button>
                        <button
                            className={`filterBtn ${filter === "past" ? "active" : ""}`}
                            onClick={() => setFilter("past")}
                        >
                            Past
                        </button>
                    </div>
                </div>

                {bookings.length === 0 ? (
                    <div className="noBookings">
                        <FontAwesomeIcon icon={faSuitcase} className="emptyIcon" />
                        <p className="emptyMessage">You don't have any bookings yet.</p>
                        <Link to="/" className="browseHotels">
                            Browse Hotels
                        </Link>
                    </div>
                ) : (
                    <div className="bookingList">
                        {filteredBookings.map((booking) => (
                            <div key={booking._id} className="bookingCard">
                                <span className={`statusBadge status-${getBookingStatus(booking)}`}>
                                    <FontAwesomeIcon icon={getBookingStatus(booking) === "upcoming" ? faCalendarCheck : faCalendarXmark} />{" "}
                                    {getBookingStatus(booking).charAt(0).toUpperCase() + getBookingStatus(booking).slice(1)}
                                </span>

                                <Link to={`/hotels/${booking.hotelId}`} className="hotelTitle">
                                    <FontAwesomeIcon icon={faHotel} />
                                    <h2>{booking.hotelName || "Hotel Name"}</h2>
                                </Link>

                                <div className="bookingDetails">
                                    <div className="detailRow">
                                        <FontAwesomeIcon icon={faCalendarDays} />
                                        <div className="dates">
                                            <p>Check-in: {formatDate(booking.checkInDate)}</p>
                                            <p>Check-out: {formatDate(booking.checkOutDate)}</p>
                                        </div>
                                    </div>

                                    <div className="detailRow">
                                        <FontAwesomeIcon icon={faUsers} />
                                        <div className="guests">
                                            <p>
                                                Rooms: {booking.options?.room || 1},
                                                Adults: {booking.options?.adult || 1},
                                                Children: {booking.options?.children || 0}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="detailRow">
                                        <FontAwesomeIcon icon={faMoneyBill} />
                                        <p className="totalPrice">Rs. {booking.amount}</p>
                                    </div>
                                </div>

                                {getBookingStatus(booking) === "upcoming" && (
                                    <button
                                        className="cancelButton"
                                        onClick={() => handleCancelClick(booking)}
                                    >
                                        <FontAwesomeIcon icon={faCalendarXmark} /> Cancel Booking
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {showCancelModal && (
                    <div className="cancelModal">
                        <div className="modalContent">
                            <FontAwesomeIcon icon={faExclamationTriangle} className="modalIcon" />
                            <h3>Cancel Booking</h3>
                            <p>Are you sure you want to cancel this booking?</p>
                            <p className="modalNote">This action cannot be undone.</p>
                            <div className="modalButtons">
                                <button className="confirmCancel" onClick={handleConfirmCancel}>
                                    Yes, Cancel
                                </button>
                                <button className="dismissCancel" onClick={() => setShowCancelModal(false)}>
                                    No, Keep it
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default MyBookings;