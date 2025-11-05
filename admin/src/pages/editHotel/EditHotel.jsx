import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./editHotel.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";

const EditHotel = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [hotel, setHotel] = useState({
        name: "",
        city: "",
        address: "",
        cheapestPrice: "",
        featured: false,
    });

    useEffect(() => {
        const fetchHotel = async () => {
            try {
                const res = await axios.get(`http://localhost:8801/api/hotels/find/${id}`);
                setHotel(res.data);
            } catch (err) {
                console.error("Failed to fetch hotel:", err);
            }
        };
        fetchHotel();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setHotel((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:8801/api/hotels/${id}`, hotel, {
                withCredentials: true,
            });
            alert("Hotel updated successfully!");
            navigate("/hotels");
        } catch (err) {
            console.error("Update failed:", err);
            alert("Failed to update hotel.");
        }
    };

    return (
        <div className="editHotel">
            <Sidebar />
            <div className="editContainer">
                <Navbar />
                <div className="editFormWrapper">
                    <h1>Edit Hotel</h1>
                    <form onSubmit={handleSubmit}>
                        <label>Hotel Name</label>
                        <input type="text" name="name" value={hotel.name} onChange={handleChange} required />

                        <label>City</label>
                        <input type="text" name="city" value={hotel.city} onChange={handleChange} required />

                        <label>Address</label>
                        <input type="text" name="address" value={hotel.address} onChange={handleChange} />

                        <label>Cheapest Price</label>
                        <input type="number" name="cheapestPrice" value={hotel.cheapestPrice} onChange={handleChange} />

                        <label>
                            <input
                                type="checkbox"
                                name="featured"
                                checked={hotel.featured}
                                onChange={handleChange}
                            />{" "}
                            Featured
                        </label>

                        <button type="submit">Save Changes</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditHotel;
