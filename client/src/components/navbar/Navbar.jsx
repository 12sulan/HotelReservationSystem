import "./navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const Navbar = () => {
  const { user, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/"); // Redirect to home after logout
  };

  return (
    <div className="navbar">
      <div className="navContainer">
        <Link to="/" className="logo">
          LICT<span className="logo-highlight">bookin</span>
        </Link>

        {user ? (
          <div className="navItems">
            <span className="username">Hi, {user.username}</span>

            {/* My Bookings button */}
            <Link to="/my-bookings" className="navButton">
              My Bookings
            </Link>

            <button className="navButton logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          <div className="navItems">
            <Link to="/register" className="navButton">
              Register
            </Link>
            <Link to="/login" className="navButton login">
              Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
