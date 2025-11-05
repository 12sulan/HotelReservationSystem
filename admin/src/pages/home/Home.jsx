import { binarySearch } from "../../utils/search";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "./home.scss";
import Widget from "../../components/widget/Widget";
import Featured from "../../components/featured/Featured";
import Chart from "../../components/chart/Chart";
import Datatable from "../../components/datatable/Datatable";
import { useEffect, useState } from "react";
import axios from "axios";

const Home = () => {
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, bookingRes, hotelRes, roomRes] = await Promise.all([
          axios.get("/api/users"),
          axios.get("/api/bookings"),
          axios.get("/api/hotels"),
          axios.get("/api/rooms"),
        ]);

        // Make sure each response is an array
        const userData = Array.isArray(userRes.data) ? userRes.data : [];
        const bookingData = Array.isArray(bookingRes.data) ? bookingRes.data : [];
        const hotelData = Array.isArray(hotelRes.data) ? hotelRes.data : [];
        const roomData = Array.isArray(roomRes.data) ? roomRes.data : [];

        // Set state
        setUsers(userData);
        setBookings(bookingData);
        setHotels(hotelData);
        setRooms(roomData);

        // --- Binary search example ---
        if (userData.length > 0) {
          const idx = binarySearch(userData, userData[0]._id, (u) => u._id);
          if (idx !== -1) console.log("Binary search user found:", userData[idx]);
        }

        // --- Reduce example ---
        const totalRooms = roomData.reduce((sum) => sum + 1, 0);
        console.log("Total rooms counted using reduce:", totalRooms);

      } catch (err) {
        console.error("Dashboard fetch error:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="home">
      <Sidebar />
      <div className="homeContainer">
        <Navbar />

        <div className="widgets">
          <Widget type="user" amount={users.length} />
          <Widget type="order" amount={bookings.length} />
          <Widget type="hotel" amount={hotels.length} />
          <Widget type="room" amount={rooms.length} />
        </div>

        <div className="charts">
          <Featured />
          <Chart title="Last 6 Months (Revenue)" aspect={2 / 1} />
        </div>

        <div className="listContainer">
          <div className="listTitle">Latest Bookings</div>
          <Datatable data={bookings} type="bookings" users={users} hotels={hotels} rooms={rooms} />
        </div>
      </div>
    </div>
  );
};

export default Home;
