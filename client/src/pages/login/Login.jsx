import { useContext, useState } from "react";
import "./login.css";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState("");

  const { loading, error, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
    setValidationError("");
  };

  const handleClick = async (e) => {
    e.preventDefault();

    if (!credentials.username || !credentials.password) {
      setValidationError("Username and password are required.");
      return;
    }

    dispatch({ type: "LOGIN_START" });

    try {
      const res = await axios.post("http://localhost:8801/api/auth/login", credentials);

      if (res.data.token) {
        localStorage.setItem("authToken", res.data.token);
      }

      // Save isAdmin status in localStorage
      localStorage.setItem("isAdmin", res.data.isAdmin);

      dispatch({ type: "LOGIN_SUCCESS", payload: res.data.details });
      navigate("/")
    } catch (error) {
      dispatch({
        type: "LOGIN_FAILURE",
        payload: error.response?.data || "Login failed",
      });
    }
  };

  return (
    <div className="Login">
      <div className="lcontainer">
        <h2 className="ltitle">Welcome Back</h2>
        <p className="lsubtitle">Sign in to your luxury hotel account</p>

        <div className="input-group">
          <input
            type="text"
            placeholder="Username"
            id="username"
            onChange={handleChange}
            className="linput"
            autoComplete="username"
          />
          <i className="input-icon fas fa-user"></i>
        </div>

        <div className="passwordField">
          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              id="password"
              onChange={handleChange}
              className="linput"
              autoComplete="current-password"
            />
            <i className="input-icon fas fa-lock"></i>
          </div>
          <label className="showPassword">
            <input
              type="checkbox"
              onChange={() => setShowPassword((prev) => !prev)}
            />
            <span>Show Password</span>
          </label>
        </div>

        <button onClick={handleClick} className="lbutton" disabled={loading}>
          {loading ? (
            <>
              <span className="loading-spinner"></span>
              <span>Signing in...</span>
            </>
          ) : (
            "Sign In"
          )}
        </button>

        {validationError && <span className="error">{validationError}</span>}
        {error && <span className="error">{error}</span>}

        <p className="registerLink">
          Don't have an account? <Link to="/register">Create one now</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
