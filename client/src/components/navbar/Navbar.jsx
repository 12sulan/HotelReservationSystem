import "./navbar.css";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const Navbar = () => {
  const { user, dispatch } = useContext(AuthContext);

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
  };

  return (
    <div className="navbar">
      <div className="navContainer">
        <Link to="/" className="logo">
          LICTbookin.com
        </Link>

        {user ? (
          <div className="navItems">
            <span className="username">Hi, {user.username}</span>
            <button className="navButton" onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          <div className="navItems">
            <Link to="/register" className="navButton">
              Register
            </Link>
            <Link to="/login" className="navButton">
              Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
