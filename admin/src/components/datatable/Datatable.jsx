import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { useState } from "react";

const Datatable = ({ data: initialData, type }) => {
  const [data, setData] = useState(initialData);
  console.log("Datatable data:", data);

  const handleDelete = async (id) => {
    try {
      await fetch(`/api/${type}/${id}`, { method: "DELETE" });
      setData(data.filter((item) => item._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
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
    ],
    bookings: [
      { field: "user", headerName: "User ID", width: 200 },
      { field: "hotel", headerName: "Hotel ID", width: 200 },
      { field: "room", headerName: "Room ID", width: 150 },
      { field: "dateStart", headerName: "Start Date", width: 150 },
      { field: "dateEnd", headerName: "End Date", width: 150 },
      { field: "amount", headerName: "Amount", width: 120 },
      { field: "status", headerName: "Status", width: 120 },
    ],
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => (
        <div className="cellAction">
          <Link to={`/${type}/${params.row._id}`} style={{ textDecoration: "none" }}>
            <div className="viewButton">View</div>
          </Link>
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
        rows={data.map((item) => ({ ...item, id: item._id }))}
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
