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
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setError(null);
        setMessage(null);
    };

    // Password validation
    const isLongEnough = pw => pw.length >= 8;
    const hasTwoNumbers = pw => (pw.match(/\d/g) || []).length >= 2;
    const hasLetter = pw => /[A-Za-z]/.test(pw);
    const validatePassword = pw => isLongEnough(pw) && hasTwoNumbers(pw) && hasLetter(pw);

    const getPasswordStrength = pw => {
        let strength = 0;
        if (isLongEnough(pw)) strength++;
        if (/[A-Z]/.test(pw)) strength++;
        if (/[a-z]/.test(pw)) strength++;
        if (hasTwoNumbers(pw)) strength++;
        if (/[^A-Za-z0-9]/.test(pw)) strength++;
        return strength;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validatePassword(formData.password)) {
            setError("Password does not meet all requirements.");
            return;
        }

        setLoading(true);
        try {
            await axios.post("http://localhost:8801/api/auth/register", formData, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true
            });

            const { data: loginData } = await axios.post("http://localhost:8801/api/auth/login", {
                username: formData.username,
                password: formData.password
            }, { headers: { "Content-Type": "application/json" }, withCredentials: true });

            if (loginData.token) localStorage.setItem("authToken", loginData.token);
            localStorage.setItem("isAdmin", loginData.isAdmin);

            dispatch({ type: "LOGIN_SUCCESS", payload: loginData.details });

            setMessage("✅ Registration successful! Redirecting...");
            setTimeout(() => navigate("/"), 1500);
        } catch (err) {
            setError(`❌ ${err.response?.data?.message || err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const strength = getPasswordStrength(formData.password);
    const strengthColors = ["#ddd", "#2196f3", "#2196f3", "#2196f3", "#2196f3"];
    const strengthLabels = ["Too weak", "Weak", "Medium", "Strong", "Very Strong"];

    return (
        <div className="registerContainer">
            <form className="registerForm" onSubmit={handleSubmit}>
                <h2 className="registerTitle">Join Our Community</h2>
                <p className="registerSubtitle">Create your luxury hotel account</p>

                {/* Username */}
                <div className="input-group">
                    <i className="input-icon fas fa-user"></i>
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        autoComplete="username"
                    />
                </div>

                {/* Email */}
                <div className="input-group">
                    <i className="input-icon fas fa-envelope"></i>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        autoComplete="email"
                    />
                </div>

                {/* Password */}
                <div className="input-group password-group">
                    <i className="input-icon fas fa-lock"></i>
                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        autoComplete="new-password"
                    />
                    <button
                        type="button"
                        className="showPasswordBtn"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        <i className={`fas fa-eye${showPassword ? "-slash" : ""}`}></i>
                    </button>
                </div>

                {/* Password Strength */}
                {formData.password && (
                    <div className="passwordSecurityCard">
                        <div className="strengthMeter">
                            <div
                                className="strengthBar"
                                style={{
                                    width: `${(strength / 4) * 100}%`,
                                    backgroundColor: strengthColors[strength]
                                }}
                            ></div>
                        </div>
                        <p className="strengthLabel" style={{ color: strengthColors[strength] }}>
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

                <button type="submit" className="registerButton" disabled={loading}>
                    {loading ? "Creating account..." : "Create Account"}
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
