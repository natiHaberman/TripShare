import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Stars from "../UIElements/Stars";
import { AuthContext } from "../context/auth-context";
import { fetchRides, processRides } from "../api/getRides";
import { joinRide } from "../api/joinRide";
import "./Rides.css";

const Rides = () => {

  const navigate = useNavigate();
  const [rides, setRides] = useState([]);
  const [processedRides, setProcessedRides] = useState([]);
  const { userID, accessToken } = useContext(AuthContext);
  const [selectedOrder, setSelectedOrder] = useState("name");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    (async () => {
      const newRides = await fetchRides(accessToken);
      setRides(newRides);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (rides.length > 0) {
        const newRides = await processRides(rides, accessToken);
        setProcessedRides(newRides);
      }
    })();
  }, [rides]);

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

  // Process rides data whenever the rides state updates

  return (
    <div className="find-rides-page">
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
        {orderBy(processedRides, selectedOrder)
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
              onClick={async () => {
                await joinRide(ride.id, userID, accessToken);
                navigate("/new", {state: {ride}});
              }}
            >
              Join
            </button>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Rides;
