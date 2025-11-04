import "./footer.css";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="footer">
      <div className="fLists">
        <ul className="fList">
          <li className="fListItem">Regions</li>
          <li className="fListItem">Cities</li>
          <li className="fListItem">Districts</li>
          {/* <li className="fListItem">Airports</li> */}
          <li className="fListItem">
            <Link to="/hotels" className="footerLink">Hotels</Link>
          </li>
        </ul>
        <ul className="fList">
          <li className="fListItem">
            <Link to="/hotels" className="footerLink">Apartments</Link>
          </li>
          <li className="fListItem">
            <Link to="/hotels" className="footerLink">Resorts</Link>
          </li>
       
        </ul>
        <ul className="fList">
          <li className="fListItem">Unique places to stay</li>
          <li className="fListItem">Reviews</li>
          <li className="fListItem">Unpacked: Travel articles</li>
          <li className="fListItem">Travel communities</li>
          <li className="fListItem">Seasonal and holiday deals</li>
        </ul>
        <ul className="fList">
          <li className="fListItem">Restaurant reservations</li>
          <li className="fListItem">Travel Agents</li>
        </ul>
        <ul className="fList">
         
          <li className="fListItem">Partner Help</li>
          <li className="fListItem">
            <Link to="/customer-service" className="footerLink">Customer Service</Link>
          </li>
          <li className="fListItem">
            <Link to="/terms" className="footerLink">Terms & Conditions</Link>
          </li>

        </ul>
      </div>
      <div className="fText">Copyright © 2025 LICTbookin.</div>
    </div>
  );
};

export default Footer;
