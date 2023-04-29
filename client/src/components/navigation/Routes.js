import React, {useEffect } from "react";
import OngoingRide from "../pages/OngoingRide/OngoingRide";
import Rides from "../pages/Rides/Rides";
import NewRide from "../pages/NewRide/NewRide";
import Profile from "../pages/Profile/Profile";
import Requests from "../pages/Requests/Requests";
import Auth from "../pages/Auth/Auth";
import {
    Route,
    Routes,
    Navigate,
    useNavigate,
  } from "react-router-dom";

export const RoutesComponent = props => {
    const navigate = useNavigate();
  
    useEffect(() => {
      if (!props.isLoggedIn) {
        navigate("/login");
      }
    }, [props.isLoggedIn]);
  
    if (props.isLoggedIn) {
      return (
        <Routes>
          <Route path="/ongoing" element={<OngoingRide />} />
          <Route path="/rides" element={<Rides />} />
          <Route path="/new" element={<NewRide />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/requests" element={<Requests />} />
          <Route path="*" element={<Navigate to="/rides" replace />} />
        </Routes>
      );
    } else {
      return (
        <Routes>
          <Route path="/login" element={<Auth />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      );
    }
  };