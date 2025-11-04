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
              src="https://i.ytimg.com/vi/xElZKwcrlWw/hq720.jpg"
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
              src="https://cf.bstatic.com/xdata/images/city/max500/690334.webp?k=b99df435f06a15a1568ddd5f55d239507c0156985577681ab91274f917af6dbb&o="
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
              src="https://cf.bstatic.com/xdata/images/city/max500/689422.webp?k=2595c93e7e067b9ba95f90713f80ba6e5fa88a66e6e55600bd27a5128808fdf2&o="
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
