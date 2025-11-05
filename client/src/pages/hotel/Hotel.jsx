import "./hotel.css";
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import MailList from "../../components/mailList/MailList";
import Footer from "../../components/footer/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleArrowLeft,
  faCircleArrowRight,
  faCircleXmark,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { useContext, useState } from "react";
import useFetch from "../../hooks/useFetch";
import { useLocation, useNavigate } from "react-router-dom";
import { SearchContext } from "../../context/SearchContext";
import { AuthContext } from "../../context/AuthContext";
import Reserve from "../../components/reserve/Reserve";

const Hotel = () => {
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const [slideNumber, setSlideNumber] = useState(0);
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const { data, loading } = useFetch(`/hotels/find/${id}`);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate()
  const { dates, options } = useContext(SearchContext);

  const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;

  const dayDifference = (date1, date2) => {
    const timeDiff = Math.abs(date2.getTime() - date1.getTime());
    return Math.ceil(timeDiff / MILLISECONDS_PER_DAY);
  };


  const days =
    dates?.length > 0 && dates[0].startDate && dates[0].endDate
      ? dayDifference(new Date(dates[0].endDate), new Date(dates[0].startDate))
      : 1;

  const handleOpen = (i) => {
    setSlideNumber(i);
    setOpen(true);
  };

  const handleMove = (direction) => {
    let newSlideNumber;

    if (direction === "l") {
      newSlideNumber = slideNumber === 0 ? 5 : slideNumber - 1;
    } else {
      newSlideNumber = slideNumber === 5 ? 0 : slideNumber + 1;
    }

    setSlideNumber(newSlideNumber);
  };

  const handleClick = () => {
    if (user) {
      setOpenModal(true);
    } else {
      navigate("/login")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {loading ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-pulse text-gray-600">Loading...</div>
        </div>
      ) : (
        <div className="hotelContainer">
          {open && (
            <div className="slider">
              <div className="fixed inset-0 bg-black bg-opacity-90 z-50">
                <div className="relative w-full h-full">
                  <FontAwesomeIcon
                    icon={faCircleXmark}
                    className="absolute top-4 right-4 text-4xl text-white opacity-75 hover:opacity-100 cursor-pointer transition-opacity z-50"
                    onClick={() => setOpen(false)}
                  />
                  <div className="flex items-center justify-center h-full">
                    <FontAwesomeIcon
                      icon={faCircleArrowLeft}
                      className="absolute left-4 text-4xl text-white opacity-75 hover:opacity-100 cursor-pointer transition-opacity"
                      onClick={() => handleMove("l")}
                    />
                    <div className="sliderWrapper">
                      <img
                        src={data.photos[slideNumber]}
                        alt={`Hotel view ${slideNumber + 1}`}
                        className="max-w-[90vw] max-h-[90vh] object-contain"
                      />
                    </div>
                    <FontAwesomeIcon
                      icon={faCircleArrowRight}
                      className="absolute right-4 text-4xl text-white opacity-75 hover:opacity-100 cursor-pointer transition-opacity"
                      onClick={() => handleMove("r")}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="hotelWrapper">
            <button className="bookNow" onClick={handleClick}>
              Reserve or Book Now!
            </button>
            <h1 className="hotelTitle">{data.name}</h1>
            <div className="hotelAddress">
              <FontAwesomeIcon icon={faLocationDot} className="text-primary" />
              <span>{data.address || "Elton St 125 New York"}</span>
            </div>
            <div className="flex flex-col gap-4 mt-4">
              <span className="hotelDistance">
                <span className="inline-block px-2 py-1 bg-green-50 text-green-700 rounded-full text-sm">
                  Excellent location
                </span>
                {" – "}{data.distance}m from Nawalparasi.
              </span>
              <span className="hotelPriceHighlight">
                Book a stay over ${data.cheapestPrice} and get a free airport taxi!
              </span>
            </div>
            <div className="hotelImages">
              {data.photos?.map((photo, i) => (
                <div className="hotelImgWrapper" key={i}>
                  <img
                    onClick={() => handleOpen(i)}
                    src={photo}
                    alt=""
                    className="hotelImg"
                  />
                </div>
              ))}
            </div>
            <div className="hotelDetails">
              <div className="hotelDetailsTexts">
                <h1 className="hotelTitle">{data.title}</h1>
                <p className="hotelDesc">{data.discrip}</p>
              </div>
              <div className="hotelDetailsPrice">
                <div className="space-y-4">
                  <h1 className="text-xl font-semibold">Perfect for a {days}-night stay!</h1>
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-green-50 rounded-full">
                      <FontAwesomeIcon icon={faLocationDot} className="text-green-600" />
                    </div>
                    <span className="text-gray-600">
                      Located in the heart of the city, this property has an
                      <span className="font-semibold text-green-600"> excellent location score of 9.8!</span>
                    </span>
                  </div>
                  <div className="border-t border-gray-100 pt-4">
                    <h2 className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-primary">
                        ${days * data.cheapestPrice * (options?.room || 1)}
                      </span>
                      <span className="text-gray-500">for {days} nights</span>
                    </h2>
                  </div>
                  <button
                    onClick={handleClick}
                    className="w-full py-3 bg-primary hover:bg-primary-dark transition-colors rounded-lg text-white font-semibold shadow-sm hover:shadow-md"
                  >
                    Reserve or Book Now!
                  </button>
                </div>
              </div>
            </div>
          </div>
          <MailList />
          <Footer />
        </div>
      )}
      {openModal && <Reserve setOpen={setOpenModal} hotelId={id} />}
    </div>
  );
};

export default Hotel;
