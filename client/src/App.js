import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import MainNavigation from "./Navigation/MainNavigation";
import { AuthContext } from "./context/auth-context";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import NewRide from "./pages/NewRide";
import Rides from "./pages/Rides";
import Requests from "./pages/Requests";
import OngoingRide from "./pages/OngoingRide";
import { useAuth } from "./hooks/auth-hook";

function App() {
  const { accessToken, login, logout, refresh, userID, isLoggedIn, register } = useAuth();

  useEffect(() => {
    if (isLoggedIn) {
      const tokenRefreshInterval = setInterval(() => {
        refresh();
      }, 4 * 60 * 1000);

      return () => {
        clearInterval(tokenRefreshInterval);
      };
    }
  }, [isLoggedIn, refresh]);

  let routes;

  if (isLoggedIn) {
    routes = (
      <Routes>
        <Route path="/" element={<Rides />} />
        <Route path="/ongoing" element={<OngoingRide />} />
        <Route path="/rides" element={<Rides />} />
        <Route path="/new" element={<NewRide />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/requests" element={<Requests />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  } else {
    routes = (
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }
  return (
    <AuthContext.Provider
      value={{ isLoggedIn, login, logout, accessToken, userID, register }}
    >
      <Router>
        <MainNavigation />
        <main>{routes}</main>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
