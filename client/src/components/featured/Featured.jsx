import { useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import "./featured.css";

const Featured = () => {
  const navigate = useNavigate();
  const { data, loading } = useFetch("/hotels/countByCity?cities=nawalparasi,chitwan,butwal");

  const handleClick = (city) => {
    navigate(`/hotels?city=${city}`);
  };

  return (
    <div className="featured">
      {loading ? (
        "loading please wait"
      ) : (
        <>
          <div className="featuredItem" onClick={() => handleClick("nawalparasi")}>
            <img
                src="https://q-xx.bstatic.com/xdata/images/hotel/840x460/467466070.jpg?k=20430c4ffea931945c05ee9ca668fa6c4a4a7a80c892067034110b07b453cc47&o="
              alt=""
              className="featuredImg"
            />
            <div className="featuredTitles">
              <h1>Nawalparasi</h1>
              <h2>{data[0]} properties</h2>
            </div>
          </div>

          <div className="featuredItem" onClick={() => handleClick("chitwan")}>
            <img
                src="https://i.pinimg.com/736x/08/21/c8/0821c8aa50b26cfbf50af3d71ec5a7a7.jpg"
              alt=""
              className="featuredImg"
            />
            <div className="featuredTitles">
              <h1>Chitwan</h1>
              <h2>{data[1]} properties</h2>
            </div>
          </div>

          <div className="featuredItem" onClick={() => handleClick("butwal")}>
            <img
                src="https://nepaltourismhub.com/wp-content/uploads/2020/01/87797d603fb2fb7ab535d8f1c5613ec1.jpg"
              alt=""
              className="featuredImg"
            />
            <div className="featuredTitles">
              <h1>Butwal</h1>
              <h2>{data[2]} properties</h2>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Featured;
