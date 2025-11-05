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
    setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Format the data based on specific field requirements
      const newItem = { ...info };

      // Handle room numbers for room creation
      if (newItem.roomNumbers) {
        newItem.roomNumbers = newItem.roomNumbers.split(',').map(num => ({
          number: num.trim()
        }));
      }

      // Convert checkbox values to boolean
      if (newItem.featured !== undefined) {
        newItem.featured = Boolean(newItem.featured);
      }

      // Convert numeric fields
      if (newItem.price) newItem.price = Number(newItem.price);
      if (newItem.maxPeople) newItem.maxPeople = Number(newItem.maxPeople);

      console.log("Submitting to endpoint:", apiEndpoint);
      console.log("Data being sent:", newItem);

      const response = await axios.post(apiEndpoint, newItem, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        }
      });

      console.log("Response:", response.data);
      alert("Item successfully added!");

      // Navigate back to list view
      window.location.href = window.location.pathname.split('/new')[0];
    } catch (err) {
      console.error("Error adding item:", err.response?.data || err.message);
      const errorMessage = err.response?.data?.message || err.response?.data || err.message;
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
