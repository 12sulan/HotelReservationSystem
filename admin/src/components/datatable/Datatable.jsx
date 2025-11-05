import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const Datatable = ({ data = [], type, users = [], hotels = [], rooms = [] }) => {
  const [tableData, setTableData] = useState(data);

  const usersMap = Object.fromEntries(users.map(u => [u._id, u.username]));
  const hotelsMap = Object.fromEntries(hotels.map(h => [h._id, h.name]));
  const roomsMap = Object.fromEntries(rooms.map(r => [r._id, r.title]));

  const enhancedData =
    type === "bookings"
      ? data.map(b => ({
        ...b,
        user: b.username || "Unknown User",
        hotel: b.hotelName || "Unknown Hotel",
        room: Array.isArray(b.roomNumbers)
          ? b.roomNumbers.join(", ")
          : "No Room",
      }))
      : data;

  useEffect(() => {
    setTableData(data);
  }, [data]);

  const handleDelete = async (id) => {
    if (!window.confirm(`Are you sure you want to delete this ${type.slice(0, -1)}?`)) return;

    try {
      await axios.delete(`http://localhost:8801/api/${type}/${id}`, { withCredentials: true });
      setTableData(prev => prev.filter(item => item._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete. Please try again.");
    }
  };

  const columnsMap = {
    users: [
      { field: "username", headerName: "Username", width: 200 },
      { field: "email", headerName: "Email", width: 250 },
      { field: "isAdmin", headerName: "Admin", width: 120, type: "boolean" },
    ],
    hotels: [
      { field: "name", headerName: "Hotel Name", width: 200 },
      { field: "city", headerName: "City", width: 150 },
      { field: "cheapestPrice", headerName: "Price", width: 120 },
      { field: "featured", headerName: "Featured", width: 120, type: "boolean" },
    ],
    rooms: [
      { field: "title", headerName: "Room Title", width: 200 },
      { field: "price", headerName: "Price", width: 120 },
      { field: "maxPeople", headerName: "Max People", width: 150 },
      { field: "hotel", headerName: "Hotel ID", width: 220 },
    ],
    bookings: [
      { field: "user", headerName: "User", width: 150 },
      { field: "hotel", headerName: "Hotel", width: 150 },
      { field: "room", headerName: "Room Numbers", width: 150 },
      {
        field: "checkInDate",
        headerName: "Check In",
        width: 180,
        valueFormatter: (params) => new Date(params.value).toLocaleDateString()
      },
      {
        field: "checkOutDate",
        headerName: "Check Out",
        width: 180,
        valueFormatter: (params) => new Date(params.value).toLocaleDateString()
      },
      {
        field: "amount",
        headerName: "Amount",
        width: 120,
        valueFormatter: (params) => `$${params.value}`
      },
      { field: "status", headerName: "Status", width: 120 },
    ],
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 260,
      renderCell: (params) => (
        <div className="cellAction">
          <Link to={`/${type}/${params.row._id}`} style={{ textDecoration: "none" }}>
            <div className="viewButton">View</div>
          </Link>

          {type === "hotels" && (
            <Link to={`/hotels/edit/${params.row._id}`} style={{ textDecoration: "none" }}>
              <div className="editButton">Edit</div>
            </Link>
          )}

          {type === "rooms" && (
            <Link to={`/rooms/edit/${params.row._id}`} style={{ textDecoration: "none" }}>
              <div className="editButton">Edit</div>
            </Link>
          )}

          <div className="deleteButton" onClick={() => handleDelete(params.row._id)}>
            Delete
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="datatable">
      <DataGrid
        className="datagrid"
        rows={enhancedData.map(item => ({ ...item, id: item._id }))}
        columns={columnsMap[type].concat(actionColumn)}
        pageSize={10}
        rowsPerPageOptions={[10]}
        checkboxSelection
        disableSelectionOnClick
      />
    </div>
  );
};

export default Datatable;
