// src/components/NewHotelForm.jsx
import { hotelInputs } from "../formSource.js";
import { useState } from "react";
import axios from "axios";

const NewHotelForm = () => {
  const [hotelData, setHotelData] = useState({});
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setHotelData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const res = await axios.post("http://localhost:8801/api/hotels", hotelData);
      setSuccess("Hotel added successfully!");
      setHotelData({});
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "40px" }}>
      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: "white",
          padding: "25px 30px",
          borderRadius: "10px",
          width: "350px",
          boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
        }}
      >
        <h3 style={{ color: "#2196f3", textAlign: "center", marginBottom: "15px" }}>
          Add New Hotel
        </h3>

        {hotelInputs.map((input) => (
          <div key={input.id} style={{ marginBottom: "12px" }}>
            <label style={{ fontSize: "13px", marginBottom: "4px", display: "block" }}>
              {input.label}
            </label>
            <input
              type={input.type}
              name={input.id}
              placeholder={input.placeholder}
              value={hotelData[input.id] || ""}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "8px 10px",
                fontSize: "13px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            />
          </div>
        ))}

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#2196f3",
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          Add Hotel
        </button>

        {success && <p style={{ color: "green", marginTop: "10px", textAlign: "center" }}>{success}</p>}
        {error && <p style={{ color: "red", marginTop: "10px", textAlign: "center" }}>{error}</p>}
      </form>
    </div>
  );
};

export default NewHotelForm;
