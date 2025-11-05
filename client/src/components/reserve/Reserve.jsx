import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import "./reserve.css";
import useFetch from "../../hooks/useFetch";
import { useContext, useState } from "react";
import { SearchContext } from "../../context/SearchContext";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Reserve = ({ setOpen, hotelId }) => {
  const { data, loading, error } = useFetch(`/hotels/room/${hotelId}`);
  const { dates } = useContext(SearchContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [selectedRooms, setSelectedRooms] = useState([]);

  // Get all dates in range
  const getDatesInRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const date = new Date(start.getTime());
    let list = [];
    while (date <= end) {
      list.push(new Date(date).getTime());
      date.setDate(date.getDate() + 1);
    }
    return list;
  };

  const alldates =
    Array.isArray(dates) && dates.length > 0
      ? getDatesInRange(dates[0].startDate, dates[0].endDate)
      : [];

  const isAvailable = (roomNumber) => {
    if (!roomNumber?.unavailableDates) return true;
    return !roomNumber.unavailableDates.some((date) =>
      alldates.includes(new Date(date).getTime())
    );
  };

  const handleSelect = (e) => {
    const checked = e.target.checked;
    const value = e.target.value;
    setSelectedRooms((prev) =>
      checked ? [...prev, value] : prev.filter((item) => item !== value)
    );
  };

  const handleReserve = async () => {
    if (!user) return alert("You must be logged in to reserve!");

    if (selectedRooms.length === 0) {
      alert("Please select at least one room.");
      return;
    }

    if (!alldates.length) {
      alert("Please select valid dates.");
      return;
    }

    try {
      // 1️⃣ Update room availability for each room
      await Promise.all(
        selectedRooms.map((roomId) =>
          axios.put(
            `http://localhost:8801/api/rooms/availability/${roomId}`,
            { dates: alldates }
          )
        )
      );

      // 2️⃣ Calculate total price
      let totalPrice = 0;
      selectedRooms.forEach((roomId) => {
        data.forEach((room) => {
          const found = room.roomNumbers.find((r) => r._id === roomId);
          if (found) totalPrice += room.price;
        });
      });
      totalPrice *= alldates.length; // number of nights

      // 3️⃣ Create booking
      const bookingData = {
        hotelId,
        roomNumbers: selectedRooms,
        startDate: dates[0].startDate,
        endDate: dates[0].endDate,
        total: totalPrice,
      };

      await axios.post(
        "http://localhost:8801/api/bookings",
        bookingData,
        {
          headers: { Authorization: `Bearer ${user.token}` },
          withCredentials: true
        },
      );

      alert("Booking successful!");
      setOpen(false);
      navigate("/my-bookings"); // redirect to bookings page
    } catch (err) {
      console.error("Booking error:", err.response || err);
      alert(err.response?.data?.message || "Booking failed.");
    }
  };

  if (loading) return <div className="reserve">Loading rooms...</div>;
  if (error) return <div className="reserve">Failed to load rooms.</div>;

  const rooms = Array.isArray(data) ? data : [];

  return (
    <div className="reserve">
      <div className="rContainer">
        <FontAwesomeIcon
          icon={faCircleXmark}
          className="rClose"
          onClick={() => setOpen(false)}
        />
        <span>Select your rooms :</span>

        {rooms.length === 0 ? (
          <p style={{ textAlign: "center", color: "#888" }}>
            No rooms available for this hotel.
          </p>
        ) : (
          rooms.map((item) => (
            <div className="rItem" key={item._id}>
              <div className="rItemInfo">
                <div className="rTitle">{item.title}</div>
                <div className="rDiscrip">{item.discrip}</div>
                <div className="rMax">
                  Max people: <b>{item.maxpeople}</b>
                </div>
                <div className="rPrice">Rs. {item.price}</div>
              </div>

              <div className="rSelectRooms">
                {item.roomNumbers?.map((roomNumber) => (
                  <div className="room" key={roomNumber._id}>
                    <label>{roomNumber.number}</label>
                    <input
                      type="checkbox"
                      value={roomNumber._id}
                      onChange={handleSelect}
                      disabled={!isAvailable(roomNumber)}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))
        )}

        <button onClick={handleReserve} className="rButton">
          Reserve now!
        </button>
      </div>
    </div>
  );
};

export default Reserve;
