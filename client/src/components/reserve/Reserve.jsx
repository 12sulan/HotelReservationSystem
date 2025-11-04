import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import "./reserve.css";
import useFetch from "../../hooks/useFetch";
import { useContext, useState } from "react";
import { SearchContext } from "../../context/SearchContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Reserve = ({ setOpen, hotelId }) => {
  const [selectedRooms, setSelectedRooms] = useState([]);
  const { data, loading, error } = useFetch(`/hotels/room/${hotelId}`);
  const { dates } = useContext(SearchContext);
  const navigate = useNavigate();

  // 🧭 helper to get all dates in range
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

  // ✅ Safely compute dates (avoid undefined errors)
  const alldates =
    Array.isArray(dates) && dates.length > 0
      ? getDatesInRange(dates[0].startDate, dates[0].endDate)
      : [];

  const isAvailable = (roomNumber) => {
    if (!roomNumber?.unavailableDates) return true;

    const isFound = roomNumber.unavailableDates.some((date) =>
      alldates.includes(new Date(date).getTime())
    );
    return !isFound;
  };

  const handleSelect = (e) => {
    const checked = e.target.checked;
    const value = e.target.value;
    setSelectedRooms((prev) =>
      checked ? [...prev, value] : prev.filter((item) => item !== value)
    );
  };

  const handleClick = async () => {
    if (!selectedRooms || selectedRooms.length === 0) {
      alert("Please select at least one room to reserve.");
      return;
    }

    if (!alldates || alldates.length === 0) {
      alert("Please select valid dates before reserving.");
      return;
    }

    try {
      await Promise.all(
        selectedRooms.map((roomId) =>
          axios.put(`http://localhost:8801/api/rooms/availability/${roomId}`, {
            dates: alldates,
          })
        )
      );
      alert("Room availability successfully updated!");
      navigate("/");
    } catch (err) {
      console.error("Error updating room availability:", err);
      alert("Failed to update availability.");
    }
  };

  // ✅ Log what backend sends for debugging
  console.log("Reserve data from backend:", data);

  // ✅ Handle loading and error states gracefully
  if (loading) return <div className="reserve">Loading rooms...</div>;
  if (error) return <div className="reserve">Failed to load rooms.</div>;

  // ✅ Ensure we always have an array before mapping
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

        <button onClick={handleClick} className="rButton">
          Reserve now!
        </button>
      </div>
    </div>
  );
};

export default Reserve;
