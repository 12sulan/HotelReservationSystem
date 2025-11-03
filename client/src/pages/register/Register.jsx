import { useState } from "react";
import "./register.css";

const Register = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
      
        alert(`Registering user: ${formData.username}`);
    };

    return (
        <div className="registerContainer">
            <form className="registerForm" onSubmit={handleSubmit}>
                <h2>Create Account</h2>

                <label>Username</label>
                <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    placeholder="Enter username"
                />

                <label>Email</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter email"
                />

                <label>Password</label>
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Enter password"
                />

                <button type="submit" className="registerButton">Register</button>
            </form>
        </div>
    );
};

export default Register;
