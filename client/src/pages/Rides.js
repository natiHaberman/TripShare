import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Stars from "../UIElements/Stars";
import { useAuth } from "../hooks/auth-hook";
import Card from "../UIElements/Card";
import { useRides } from "../hooks/rides-hook";
import { sendRequest } from "../api/sendRequest";
import LoadingSpinner from "../UIElements/LoadingSpinner";
import "./Rides.css";

const Rides = () => {
  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState("name");
  const [filter, setFilter] = useState("all");
  const { rides, isLoading } = useRides();
  const { userID, accessToken } = useAuth();

  const orderBy = (rides, order) => {
    return rides.sort((a, b) => {
      if (order === "name") {
        return a.name.localeCompare(b.name);
      } else if (order === "rating") {
        return b.rating - a.rating;
      } else if (order === "departureTime") {
        return a.departureTime.localeCompare(b.departureTime);
      } else {
        return 0;
      }
    });
  };
  const handleJoinRide = async (rideID, userID, accessToken) => {
    try {
      const response = await sendRequest(rideID, userID, accessToken);
      alert("Request sent");
      console.log(response);
      navigate("/requests");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="find-rides-page">
      {isLoading && <LoadingSpinner asOverlay />}
      {rides.length > 0 ? (
        <>
          <div className="sort">
            <label htmlFor="sort">Sort:</label>
            <select
              id="sort"
              value={selectedOrder}
              onChange={(e) => setSelectedOrder(e.target.value)}
            >
              <option value="name">Name</option>
              <option value="rating">Rating</option>
              <option value="departureTime">Departure Time</option>
            </select>
          </div>
          <div className="filter">
            <label htmlFor="filter">Filter by:</label>
            <select
              id="filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="driver">Driver</option>
              <option value="passenger">Passenger</option>
            </select>
          </div>
          <ul className="rides-list">
            {orderBy(rides, selectedOrder)
              .filter(
                (ride) => filter === "all" || ride.role.toLowerCase() === filter
              )
              .map((ride, index) => (
                <li key={index} className="ride-item">
                  <div className="ride-info">
                    <h3>
                      {ride.name} ({ride.role})
                    </h3>
                    <p>Start: {ride.origin}</p>
                    <p>End: {ride.destination}</p>
                    <p>
                      Rating: <Stars rating={ride.rating} />
                    </p>
                    <p>Distance: {ride.distance}</p>
                    <p>Duration: {ride.duration}</p>
                    <p>Departure Time: {ride.departureTime}</p>
                  </div>
                  <button
                    className="join-button"
                    onClick={() => handleJoinRide(ride._id, userID, accessToken)}
                  >
                    Join
                  </button>
                </li>
              ))}
          </ul>
        </>
      ) : (
        <Card>
          <p>No rides available</p>
        </Card>
      )}
    </div>
  );
};

export default Rides;
