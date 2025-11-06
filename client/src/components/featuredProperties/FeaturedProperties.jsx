import "./featuredProperties.css";
import useFetch from "../../hooks/useFetch";
import { Link } from "react-router-dom";

const FeaturedProperties = () => {
  const { data, loading, error } = useFetch("/hotels?featured=true&limit=6");

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading featured properties.</div>;

  return (
    <div className="fp">
      {data.map((item) => (
        <Link
          to={`/hotels/${item._id}`} // Navigate to individual hotel page
          className="fpItem"
          key={item._id}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <img
            src={item.photos && item.photos.length > 0 ? item.photos[0] : "https://via.placeholder.com/300"}
            alt={item.name}
            className="fpImg"
          />
          <span className="fpName">{item.name}</span>
          <span className="fpCity">{item.city}</span>
          <span className="fpPrice">Starting from Rs{item.cheapestPrice}</span>
          {item.rating && (
            <div className="fpRating">
              <button>{item.rating}</button>
              <span>Excellent</span>
            </div>
          )}
        </Link>
      ))}
    </div>
  );
};

export default FeaturedProperties;
