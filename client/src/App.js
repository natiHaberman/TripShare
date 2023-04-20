import React, { useState, useCallback } from "react";
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

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = useCallback(() => {
    setIsLoggedIn(true);
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
  }, []);

  const verifiedRoutes = (
    <Routes>
      <Route path="/" element={<Rides />} />
      <Route path="/new" element={<NewRide />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
  const unverifiedRoutes = (
    <Routes>
      <Route path="/" element={<Auth />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
  return (
    <AuthContext.Provider
      value={{ isLoggedIn, setIsLoggedIn, login, logout}}
    >
      <Router>
        <MainNavigation />
        {isLoggedIn ? verifiedRoutes : unverifiedRoutes}
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
