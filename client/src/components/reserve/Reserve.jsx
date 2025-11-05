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
  const { dates, options } = useContext(SearchContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [selectedRoomType, setSelectedRoomType] = useState(null);

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

  const calculateTotalPrice = (roomType) => {
    if (!dates?.length) return 0;
    return alldates.length * roomType.price * (options?.room || 1);
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
        <button className="rClose" onClick={() => setOpen(false)}>
          <FontAwesomeIcon icon={faCircleXmark} />
        </button>

        <div className="bookingProgress">
          <div className={`progressStep ${!selectedRoomType ? 'active' : 'complete'}`}>
            1. Select Room Type
          </div>
          <div className={`progressStep ${selectedRoomType ? 'active' : ''}`}>
            2. Choose Your Room
          </div>
        </div>

        {rooms.length === 0 ? (
          <div className="emptyState">
            <div className="emptyIcon">🏠</div>
            <h3>No Rooms Available</h3>
            <p>Unfortunately, all rooms are booked for your selected dates.</p>
          </div>
        ) : !selectedRoomType ? (
          // Step 1: Room Type Selection
          <div className="roomTypeGrid">
            {rooms.map((room) => (
              <div
                key={room._id}
                className="roomTypeCard"
                onClick={() => {
                  setSelectedRoomType(room);
                  // Find first available room and select it automatically
                  const firstAvailableRoom = room.roomNumbers.find(roomNumber => isAvailable(roomNumber));
                  if (firstAvailableRoom) {
                    setSelectedRooms([firstAvailableRoom._id]);
                  }
                }}
              >
                <div className="roomTypeHeader">
                  <h3>{room.title}</h3>
                  <span className="roomPrice">
                    Rs. {room.price.toLocaleString()}
                    <span className="perNight">/night</span>
                  </span>
                </div>

                <div className="roomFeatures">
                  <div className="featureItem">
                    <span className="featureIcon">👥</span>
                    Up to {room.maxpeople} guests
                  </div>
                  <div className="featureItem">
                    <span className="featureIcon">🛏️</span>
                    {room.roomNumbers.length} rooms available
                  </div>
                </div>

                <p className="roomDescription">{room.discrip}</p>

                <div className="roomTypeFooter">
                  <div className="totalPrice">
                    <span>Total for {alldates.length} nights</span>
                    <strong>Rs. {calculateTotalPrice(room).toLocaleString()}</strong>
                  </div>
                  <button className="selectButton">
                    Select Room Type
                    <span className="arrow">→</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Step 2: Specific Room Selection
          <div className="roomSelectionStep">
            <button
              className="backButton"
              onClick={() => setSelectedRoomType(null)}
            >
              ← Back to Room Types
            </button>

            <div className="selectedRoomType">
              <h3>{selectedRoomType.title}</h3>
              <div className="selectedRoomPrice">
                Rs. {selectedRoomType.price.toLocaleString()}/night
              </div>
            </div>

            <div className="roomGrid">
              {selectedRoomType.roomNumbers?.map((roomNumber) => {
                const isRoomAvailable = isAvailable(roomNumber);
                return (
                  <label
                    className={`roomCard ${isRoomAvailable ? 'available' : 'unavailable'
                      } ${selectedRooms.includes(roomNumber._id) ? 'selected' : ''
                      }`}
                    key={roomNumber._id}
                  >
                    <div className="roomCardContent">
                      <div className="roomNumber">Room {roomNumber.number}</div>
                      <div className={`roomStatus ${isRoomAvailable ? 'available' : 'unavailable'}`}>
                        {isRoomAvailable ? 'Available' : 'Booked'}
                      </div>
                      {isRoomAvailable && (
                        <input
                          type="checkbox"
                          value={roomNumber._id}
                          onChange={handleSelect}
                          checked={selectedRooms.includes(roomNumber._id)}
                          className="roomCheckbox"
                        />
                      )}
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {selectedRoomType && (
          <div className="bookingSummary">
            <div className="summaryHeader">
              <h3>Booking Summary</h3>
              <div className="summaryDates">
                {dates?.length > 0 ? (
                  <>
                    <span className="dateRange">
                      {new Date(dates[0].startDate).toLocaleDateString()} - {new Date(dates[0].endDate).toLocaleDateString()}
                    </span>
                    <span className="nightCount">{alldates.length} nights</span>
                  </>
                ) : (
                  <span className="warning">Please select your dates first</span>
                )}
              </div>
            </div>

            <div className="summaryContent">
              <div className="summaryRow">
                <span>Room Type</span>
                <span>{selectedRoomType.title}</span>
              </div>
              <div className="summaryRow">
                <span>Number of Rooms</span>
                <span>{selectedRooms.length} selected</span>
              </div>
              <div className="summaryRow">
                <span>Price per Night</span>
                <span>Rs. {selectedRoomType.price.toLocaleString()}</span>
              </div>
              {selectedRooms.length > 0 && dates?.length > 0 && (
                <div className="summaryTotal">
                  <span>Total Amount</span>
                  <span>Rs. {(selectedRoomType.price * selectedRooms.length * alldates.length).toLocaleString()}</span>
                </div>
              )}
            </div>

            <button
              onClick={handleReserve}
              className="confirmButton"
              disabled={selectedRooms.length === 0 || !dates?.length}
            >
              {!dates?.length
                ? "Please Select Dates First"
                : selectedRooms.length === 0
                  ? "Select a Room to Continue"
                  : `Confirm Booking • Rs. ${(selectedRoomType.price * selectedRooms.length * alldates.length).toLocaleString()}`}
            </button>

            {selectedRooms.length > 0 && dates?.length > 0 && (
              <div className="bookingNotes">
                <div className="noteItem">
                  <span className="noteIcon">✓</span>
                  Free cancellation before 24 hours
                </div>
                <div className="noteItem">
                  <span className="noteIcon">🔒</span>
                  Secure payment process
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reserve;
