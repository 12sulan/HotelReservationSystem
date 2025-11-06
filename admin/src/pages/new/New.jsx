import "./new.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState } from "react";
import axios from "axios";

const New = ({ inputs, title, apiEndpoint }) => {
  const [file, setFile] = useState("");
  const [info, setInfo] = useState({});

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setInfo((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const newItem = { ...info };

      // Handle roomNumbers for rooms
      if (newItem.roomNumbers) {
        newItem.roomNumbers = newItem.roomNumbers.split(",").map((num) => ({
          number: num.trim(),
        }));
      }

      // Convert numeric fields
      if (newItem.price) newItem.price = Number(newItem.price);
      if (newItem.maxPeople) newItem.maxPeople = Number(newItem.maxPeople);

      // If hotel creation, ensure cheapestPrice is set
      if (apiEndpoint.includes("hotels")) {
        if (!newItem.price) throw new Error("Price is required for hotels");
        newItem.cheapestPrice = newItem.price;

        // Capitalize type to match enum
        const validTypes = ["Hotel", "Apartment", "Resort"];
        if (!validTypes.includes(newItem.type)) {
          newItem.type =
            newItem.type.charAt(0).toUpperCase() +
            newItem.type.slice(1).toLowerCase();
        }
      }

      console.log("Submitting to endpoint:", apiEndpoint);
      console.log("Data being sent:", newItem);

      const response = await axios.post(apiEndpoint, newItem, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Response:", response.data);
      alert("Item successfully added!");

      // Navigate back to list view
      window.location.href = window.location.pathname.split("/new")[0];
    } catch (err) {
      console.error("Error adding item:", err.response?.data || err.message);
      const errorMessage =
        err.response?.data?.message || err.response?.data || err.message;
      alert(`Failed to add item: ${errorMessage}`);
    }
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>{title}</h1>
        </div>
        <div className="bottom">
          <div className="left">
            <img
              src={
                file
                  ? URL.createObjectURL(file)
                  : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
              }
              alt=""
            />
          </div>
          <div className="right">
            <form onSubmit={handleSubmit}>
              <div className="formInput">
                <label htmlFor="file">
                  Image: <DriveFolderUploadOutlinedIcon className="icon" />
                </label>
                <input
                  type="file"
                  id="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  style={{ display: "none" }}
                />
              </div>

              {inputs.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  <input
                    id={input.id}
                    type={input.type}
                    placeholder={input.placeholder}
                    onChange={handleChange}
                    checked={input.type === "checkbox" ? info[input.id] || false : undefined}
                  />
                </div>
              ))}

              <button type="submit">Send</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default New;
