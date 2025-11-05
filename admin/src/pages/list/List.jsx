import "./list.scss";
import Datatable from "../../components/datatable/Datatable";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const List = ({ type }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:8801/api/${type}`,
          { withCredentials: true }
        );
        setData(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setLoading(false);
      }
    };
    fetchData();
  }, [type]);

  return (
    <div className="list">
      <div className="listContainer">
        <div className="datatableTitle">
          {type.charAt(0).toUpperCase() + type.slice(1)}
          <Link to={`/${type}/new`} className="link">
            Add New
          </Link>
        </div>
        {loading ? (
          <p>Loading {type}...</p>
        ) : (
          <Datatable data={data} type={type} />
        )}
      </div>
    </div>
  );
};

export default List;
