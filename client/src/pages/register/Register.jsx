import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./register.css";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

const Register = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { dispatch } = useContext(AuthContext);

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    // Password validation helpers
    const isLongEnough = (password) => password.length >= 8;
    const hasTwoNumbers = (password) => (password.match(/\d/g) || []).length >= 2;
    const hasLetter = (password) => /[A-Za-z]/.test(password);
    const validatePassword = (password) =>
        isLongEnough(password) && hasTwoNumbers(password) && hasLetter(password);

    // Password strength
    const getPasswordStrength = (password) => {
        let strength = 0;
        if (isLongEnough(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (hasTwoNumbers(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        return strength;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        setError(null);

        if (!validatePassword(formData.password)) {
            setError("Password does not meet all requirements.");
            return;
        }

        setLoading(true);
        try {
            const { data } = await axios.post("http://localhost:8801/api/auth/register",
                formData,
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true
                }
            );

            // Auto-login
            const { data: loginData } = await axios.post("http://localhost:8801/api/auth/login",
                {
                    username: formData.username,
                    password: formData.password,
                },
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true
                }
            );
            if (!loginRes.ok) throw new Error(loginData.message || "Login failed");

            dispatch({ type: "LOGIN_SUCCESS", payload: loginData.details });

            setMessage("✅ Registration successful! Redirecting...");
            setTimeout(() => navigate("/"), 1500);
        } catch (err) {
            setError(`❌ ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const strength = getPasswordStrength(formData.password);
    const strengthColors = ["#ddd", "#ff5252", "#ffb300", "#4caf50", "#00796b"];
    const strengthLabels = ["Too weak", "Weak", "Medium", "Strong", "Very Strong"];

    return (
        <div className="registerContainer">
            <form className="registerForm" onSubmit={handleSubmit}>
                <h2 className="registerTitle">Join Our Community</h2>
                <p className="registerSubtitle">Create your luxury hotel account</p>

                <div className="input-group">
                    <i className="input-icon fas fa-user"></i>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        placeholder="Choose a username"
                        className="register-input"
                        autoComplete="username"
                    />
                </div>

                <div className="input-group">
                    <i className="input-icon fas fa-envelope"></i>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="Enter your email"
                        className="register-input"
                        autoComplete="email"
                    />
                </div>

                <div className="input-group">
                    <i className="input-icon fas fa-lock"></i>
                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        placeholder="Create a password"
                        className="register-input"
                        autoComplete="new-password"
                    />
                    <button
                        type="button"
                        className="showPasswordBtn"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        <i className={`fas fa-eye${showPassword ? '-slash' : ''}`}></i>
                    </button>
                </div>

                {formData.password && (
                    <div className="passwordSecurityCard">
                        <div className="strengthMeter">
                            <div
                                className="strengthBar"
                                style={{
                                    width: `${(strength / 4) * 100}%`,
                                    backgroundColor: strengthColors[strength],
                                }}
                            ></div>
                        </div>
                        <p
                            className="strengthLabel"
                            style={{ color: strengthColors[strength] }}
                        >
                            {strengthLabels[strength]}
                        </p>
                        <ul className="passwordChecklist">
                            <li className={isLongEnough(formData.password) ? "valid" : "invalid"}>
                                At least 8 characters
                            </li>
                            <li className={hasTwoNumbers(formData.password) ? "valid" : "invalid"}>
                                At least 2 numbers
                            </li>
                            <li className={hasLetter(formData.password) ? "valid" : "invalid"}>
                                At least 1 letter
                            </li>
                        </ul>
                    </div>
                )}

                <div className="passwordSecurityCard">
                    <p className="strengthLabel">Password Strength: {strengthLabels[strength]}</p>
                    <div className="strengthMeter">
                        <div
                            className="strengthBar"
                            style={{
                                width: `${(strength / 4) * 100}%`,
                                backgroundColor: strengthColors[strength],
                            }}
                        ></div>
                    </div>
                    <ul className="passwordChecklist">
                        <li className={isLongEnough(formData.password) ? "valid" : "invalid"}>
                            At least 8 characters
                        </li>
                        <li className={hasTwoNumbers(formData.password) ? "valid" : "invalid"}>
                            At least 2 numbers
                        </li>
                        <li className={hasLetter(formData.password) ? "valid" : "invalid"}>
                            At least 1 letter
                        </li>
                    </ul>
                </div>

                <button type="submit" className="registerButton" disabled={loading}>
                    {loading ? (
                        <>
                            <span className="loading-spinner"></span>
                            <span>Creating account...</span>
                        </>
                    ) : (
                        "Create Account"
                    )}
                </button>

                {message && <p className="successMessage">{message}</p>}
                {error && <p className="errorMessage">{error}</p>}

                <p className="loginRedirect">
                    Already have an account? <Link to="/login">Sign in here</Link>
                </p>
            </form>
        </div>
    );
};

export default Register;
