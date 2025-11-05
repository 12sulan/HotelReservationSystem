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
  const [stats, setStats] = useState({
    users: { amount: 0, diff: 0 },
    bookings: { amount: 0, diff: 0 },
    earnings: { amount: 0, diff: 0 },
    balance: { amount: 0, diff: 0 },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch users
        const userRes = await axios.get("/api/users");
        setUsers(userRes.data);

        // Fetch bookings
        const bookingRes = await axios.get("/api/bookings");
        setBookings(bookingRes.data);

        // Calculate stats
        const userCount = userRes.data.length;
        const bookingCount = bookingRes.data.length;
        const earnings = bookingRes.data.reduce((sum, b) => sum + b.amount, 0);

        // Example: calculate percentage difference from previous period
        const calculateDiff = (current, previous) => {
          if (!previous) return 0;
          return Math.round(((current - previous) / previous) * 100);
        };

        setStats({
          users: { amount: userCount, diff: calculateDiff(userCount, 50) }, // replace 50 with previous period
          bookings: { amount: bookingCount, diff: calculateDiff(bookingCount, 40) },
          earnings: { amount: earnings, diff: calculateDiff(earnings, 2000) },
          balance: { amount: earnings, diff: calculateDiff(earnings, 2000) }, // assuming balance = earnings
        });
      } catch (err) {
        console.error(err);
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
          <Widget type="user" amount={stats.users.amount} diff={stats.users.diff} />
          <Widget type="order" amount={stats.bookings.amount} diff={stats.bookings.diff} />
          <Widget type="earning" amount={stats.earnings.amount} diff={stats.earnings.diff} />
          <Widget type="balance" amount={stats.balance.amount} diff={stats.balance.diff} />
        </div>

        <div className="charts">
          <Featured />
          <Chart title="Last 6 Months (Revenue)" aspect={2 / 1} />
        </div>

        <div className="listContainer">
          <div className="listTitle">Latest Bookings</div>
          <Datatable data={bookings} type="bookings" />
        </div>
      </div>
    </div>
  );
};

export default Home;
