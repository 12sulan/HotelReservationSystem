import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../components/sidebar/Sidebar";
import "./editRoom.scss";
import Navbar from "../../components/navbar/Navbar";

const EditRoom = () => {
    const { id } = useParams(); // room ID
    const navigate = useNavigate();
    const [room, setRoom] = useState({
        title: "",
        price: "",
        maxPeople: "",
        desc: "",
        hotelId: "",
    });

    useEffect(() => {
        const fetchRoom = async () => {
            try {
                const res = await axios.get(`http://localhost:8801/api/rooms/${id}`);
                setRoom(res.data);
            } catch (err) {
                console.error("Failed to fetch room:", err);
            }
        };
        fetchRoom();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRoom((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:8801/api/rooms/${id}`, room);
            alert("Room updated successfully!");
            navigate(`/hotels/${room.hotelId}`); // redirect to its hotel
        } catch (err) {
            console.error("Update failed:", err);
            alert("Failed to update room.");
        }
    };

    return (
        <div className="editRoom">
            <Sidebar />
            <div className="editContainer">
                <Navbar />
                <div className="editFormWrapper">
                    <h1>Edit Room</h1>
                    <form onSubmit={handleSubmit}>
                        <label>Room Title</label>
                        <input
                            type="text"
                            name="title"
                            value={room.title}
                            onChange={handleChange}
                            required
                        />

                        <label>Price</label>
                        <input
                            type="number"
                            name="price"
                            value={room.price}
                            onChange={handleChange}
                            required
                        />

                        <label>Max People</label>
                        <input
                            type="number"
                            name="maxPeople"
                            value={room.maxPeople}
                            onChange={handleChange}
                        />

                        <label>Description</label>
                        <textarea
                            name="desc"
                            value={room.desc}
                            onChange={handleChange}
                            rows="3"
                        />

                        <button type="submit">Save Changes</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditRoom;
