import "./list.css";
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { DateRange } from "react-date-range";
import SearchItem from "../../components/searchItem/SearchItem";
import useFetch from "../../hooks/useFetch";
import { binarySearch } from "../../utils/search";

const List = () => {
  const location = useLocation();

  // Get city from URL search params
  const searchParams = new URLSearchParams(location.search);
  const cityFromUrl = searchParams.get("city");

  // Use fallback state if no navigation state is passed
  const state = location.state || {
    destination: cityFromUrl || "",
    dates: [{ startDate: new Date(), endDate: new Date(), key: "selection" }],
    options: { adult: 1, children: 0, room: 1 },
  };

  const [destination, setDestination] = useState(state.destination);
  const [dates, setDates] = useState(state.dates);
  const [openDate, setOpenDate] = useState(false);
  const [options, setOptions] = useState(state.options);
  const [min, setMin] = useState(undefined);
  const [max, setMax] = useState(undefined);
  const [filteredData, setFilteredData] = useState([]);

  const { data, loading, error, refetch } = useFetch(
    `/hotels?city=${destination}&min=${min || 0}&max=${max || 99999}`
  );

  // Handle search click
  const handleClick = () => {
    refetch();
  };

  // Apply frontend algorithms after data changes
  useEffect(() => {
    if (!data || data.length === 0 || !destination) {
      setFilteredData([]);
      return;
    }

    // Binary Search example: find first hotel that exactly matches the city
    const sortedByCity = [...data].sort((a, b) => a.city.localeCompare(b.city));
    const cityIndex = binarySearch(sortedByCity, destination.toLowerCase(), (h) =>
      h.city.toLowerCase()
    );

    let resultData;
    if (cityIndex !== -1) {
      // Exact match found, filter all hotels with same city
      resultData = sortedByCity.filter(
        (h) => h.city.toLowerCase() === destination.toLowerCase()
      );
    } else {
      // No exact match, show empty
      resultData = [];
    }

    // Second algorithm: Reduce to calculate total rooms
    const totalRooms = resultData.reduce((sum, hotel) => sum + hotel.rooms.length, 0);
    console.log(`Reduce: Total rooms in ${destination}:`, totalRooms);

    setFilteredData(resultData);
  }, [data, destination]);

  return (
    <div>
      <Navbar />
      <Header type="list" />
      <div className="listContainer">
        <div className="listWrapper">
          <div className="listSearch">
            <h1 className="lsTitle">Search</h1>

            <div className="lsItem">
              <label>Destination</label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>

            <div className="lsItem">
              <label>Check-in Date</label>
              <span onClick={() => setOpenDate(!openDate)}>
                {`${format(dates[0].startDate, "MM/dd/yyyy")} to ${format(
                  dates[0].endDate,
                  "MM/dd/yyyy"
                )}`}
              </span>
              {openDate && (
                <DateRange
                  onChange={(item) => setDates([item.selection])}
                  minDate={new Date()}
                  ranges={dates}
                />
              )}
            </div>

            <div className="lsItem">
              <label>Options</label>
              <div className="lsOptions">
                <div className="lsOptionItem">
                  <span className="lsOptionText">
                    Min price <small>per night</small>
                  </span>
                  <input
                    type="number"
                    onChange={(e) => setMin(e.target.value)}
                    className="lsOptionInput"
                  />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">
                    Max price <small>per night</small>
                  </span>
                  <input
                    type="number"
                    onChange={(e) => setMax(e.target.value)}
                    className="lsOptionInput"
                  />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">Adult</span>
                  <input
                    type="number"
                    min={1}
                    className="lsOptionInput"
                    placeholder={options.adult}
                  />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">Children</span>
                  <input
                    type="number"
                    min={0}
                    className="lsOptionInput"
                    placeholder={options.children}
                  />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">Room</span>
                  <input
                    type="number"
                    min={1}
                    className="lsOptionInput"
                    placeholder={options.room}
                  />
                </div>
              </div>
            </div>

            <button onClick={handleClick}>Search</button>
          </div>

          <div className="listResult">
            {loading ? (
              "Loading..."
            ) : error ? (
              <span>Something went wrong. Please try again later.</span>
            ) : (
              <>
                {(filteredData.length > 0 ? filteredData : []).map((item) => (
                  <SearchItem item={item} key={item._id} />
                ))}
                {filteredData.length === 0 && destination && <span>No results found.</span>}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default List;
