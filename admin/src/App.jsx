import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import List from "./pages/list/List";
import Single from "./pages/single/Single";
import New from "./pages/new/New";
import { userInputs, hotelInputs, roomInputs } from "./formSource";
import "./style/dark.scss";
import { useContext } from "react";
import { DarkModeContext } from "./context/darkModeContext";
import { AuthContext } from "./context/AuthContext";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

function App() {
  const { darkMode } = useContext(DarkModeContext);
  const { user } = useContext(AuthContext);

  const ProtectedRoute = ({ children }) => {
    if (!user || !user.isAdmin) return <Navigate to="/login" />;
    return children;
  };

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <BrowserRouter>
        <Routes>
          {/* LOGIN */}
          <Route path="/login" element={<Login />} />

          {/* HOME / DASHBOARD */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          {/* USERS */}
          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <List type="users" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users/:userId"
            element={
              <ProtectedRoute>
                <Single type="users" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users/new"
            element={
              <ProtectedRoute>
                <New inputs={userInputs} title="Add New User" type="users" />
              </ProtectedRoute>
            }
          />

          {/* HOTELS */}
          <Route
            path="/hotels"
            element={
              <ProtectedRoute>
                <List type="hotels" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hotels/:hotelId"
            element={
              <ProtectedRoute>
                <Single type="hotels" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hotels/new"
            element={
              <ProtectedRoute>
                <New inputs={hotelInputs} title="Add New Hotel" type="hotels" />
              </ProtectedRoute>
            }
          />

          {/* ROOMS */}
          <Route
            path="/rooms"
            element={
              <ProtectedRoute>
                <List type="rooms" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rooms/:roomId"
            element={
              <ProtectedRoute>
                <Single type="rooms" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rooms/new"
            element={
              <ProtectedRoute>
                <New inputs={roomInputs} title="Add New Room" type="rooms" />
              </ProtectedRoute>
            }
          />

          {/* BOOKINGS */}
          <Route
            path="/bookings"
            element={
              <ProtectedRoute>
                <List type="bookings" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bookings/:bookingId"
            element={
              <ProtectedRoute>
                <Single type="bookings" />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
