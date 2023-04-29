import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendRequest } from "../../../api/sendRequest";
import { useRides } from "../../../hooks/rides-hook";
import { AuthContext } from "../../../context/auth-context";
import Stars from "../../UIElements/Stars";
import Card from "../../UIElements/Card/Card";
import LoadingSpinner from "../../UIElements/LoadingSpinner/LoadingSpinner";
import "./Rides.css";

const Rides = () => {

  
  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState("name");
  const [filter, setFilter] = useState("all");
  const rides = useRides();
  const [isLoading, setIsLoading] = useState(false);
  const { accessToken, userID } = useContext(AuthContext);


  // Sets the order of the rides based on the order the user selected 
  const orderBy = (rides, order) => {
    return rides.sort((a, b) => {
      if (order === "name") {
        return a.username.localeCompare(b.username);
      } else if (order === "rating") {
        return b.rating - a.rating;
      } else if (order === "departureTime") {
        return a.departureTime.localeCompare(b.departureTime);
      } else {
        return 0;
      }
    });
  };

  // Sends a request to join a ride
  const handleJoinRide = async (rideID, userID, accessToken) => {
    setIsLoading(true);
    try {
      await sendRequest(rideID, userID, accessToken); // Sends request to join ride to database
      setIsLoading(false);
      alert("Request sent");
      navigate("/requests");
    } catch (error) {
      setIsLoading(false);
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
                    <p>Username: {ride.username}</p>
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
