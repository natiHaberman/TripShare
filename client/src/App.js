import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { AuthContext } from "./context/auth-context";
import { useAuth } from "./hooks/auth-hook";
import MainNavigation from "./components/navigation/MainNavigation/MainNavigation";
import Auth from "./components/pages/Auth/Auth";
import Profile from "./components/pages/Profile/Profile";
import NewRide from "./components/pages/NewRide/NewRide";
import Rides from "./components/pages/Rides/Rides";
import Requests from "./components/pages/Requests/Requests";
import OngoingRide from "./components/pages/OngoingRide/OngoingRide";

function App() {
  const { accessToken, login, logout, refresh, userID, isLoggedIn, register } =
    useAuth();
  // Refresh access token stored in local storage every 19 minutes (access token expires in 20 minutes) if user is logged in
  // using refresh token stored in cookie
  useEffect(() => {
    if (isLoggedIn) {
      const tokenRefreshInterval = setInterval(() => {
        refresh();
      }, 19 * 60 * 1000);
      return () => {
        clearInterval(tokenRefreshInterval);
      };
    }
  }, [isLoggedIn, refresh]);

  let routes;

  if (isLoggedIn) {
    routes = (
      <Routes>
        <Route path="/ongoing" element={<OngoingRide />} />
        <Route path="/rides" element={<Rides />} />
        <Route path="/new" element={<NewRide />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/requests" element={<Requests />} />
        <Route path="/" element={<Rides />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  } else {
    routes = (
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/login" element={<Auth />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }
  return (
    <AuthContext.Provider
      value={{ login, logout, accessToken, userID, register, isLoggedIn }}
    >
      <Router>
        <MainNavigation isLoggedIn={isLoggedIn} />
        <main>{routes}</main>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
