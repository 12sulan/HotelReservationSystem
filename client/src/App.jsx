import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Home from "./pages/home/Home";
import Hotel from "./pages/hotel/Hotel";
import List from "./pages/list/List";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import CustomerService from "./pages/CustomerService";
import TermsAndConditions from "./pages/TermsAndConditions";




function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/hotels" element={<List />} />
        <Route path="/hotels/:id" element={<Hotel />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
          <Route path="/customer-service" element={<CustomerService />} />
          <Route path="/terms" element={<TermsAndConditions />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
