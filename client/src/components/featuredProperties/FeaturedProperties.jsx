import "./featuredProperties.css";
import useFetch from "../../hooks/useFetch";
import { Link } from "react-router-dom";

const FeaturedProperties = () => {
  const { data, loading, error } = useFetch("/hotels?featured=true&limit=4");

  return (
    <div className="fp">
      {loading ? (
        "loading"
      ) : (
        <>
          {data.map((item) => (
            <Link
              to="/list"
              state={{
                destination: item.city, // or "all" if you want all hotels
                dates: [{ startDate: new Date(), endDate: new Date(), key: 'selection' }],
                options: { adult: 1, children: 0, room: 1 },
              }}
              className="fpItem"
              key={item._id}
              style={{ textDecoration: "none", color: "inherit" }} // remove link styles
            >
              <img src={item.photos[0]} alt="" className="fpImg" />
              <span className="fpName">{item.name}</span>
              <span className="fpCity">{item.city}</span>
              <span className="fpPrice">Starting from Rs{item.CheapestPrice}</span>
              <div className="fpRating">
                <button>{item.rating}</button>
                <span>Excellent</span>
              </div>
            </Link>
          ))}
        </>
      )}
    </div>
  );
};

export default FeaturedProperties;
