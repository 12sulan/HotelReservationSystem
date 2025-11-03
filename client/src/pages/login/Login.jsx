import { useContext, useState } from "react";
import "./login.css";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState("");

  const {  loading, error, dispatch } = useContext(AuthContext);
  const navigate = useNavigate()

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

        <input
          type="text"
          placeholder="Username"
          id="username"
          onChange={handleChange}
          className="linput"
        />

        <div className="passwordField">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            id="password"
            onChange={handleChange}
            className="linput"
          />
          <label className="showPassword">
            <input
              type="checkbox"
              onChange={() => setShowPassword((prev) => !prev)}
            />{" "}
            Show Password
          </label>
        </div>

        <button  onClick={handleClick} className="lbutton" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        {validationError && <span className="error">{validationError}</span>}
        {error && <span className="error">{error}</span>}
      </div>
    </div>
  );
};

export default Login;
