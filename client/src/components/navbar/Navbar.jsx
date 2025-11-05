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

  console.log("Navbar user:", user);

  return (
    <div className="navbar">
      <div className="navContainer">
        <Link to="/" className="logo">
          LICT<span className="logo-highlight">bookin</span>
        </Link>

        {user ? (
          <div className="navItems">
            <span className="username">Hi, {user.username}</span>

            {user.isAdmin && (
              <Link to="http://localhost:5174" className="navButton">
                Admin Panel
              </Link>
            )}

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
