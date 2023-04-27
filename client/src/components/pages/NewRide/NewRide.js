import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/auth-context";
import { newRide } from "../../../api/newRide";
import Card from "../../UIElements/Card/Card";
import LoadingSpinner from "../../UIElements/LoadingSpinner/LoadingSpinner";
import ToggleButton from "../../UIElements/ToggleButton/ToggleButton";
import { withMapLoader } from "../../mapElements/withMapLoader";
import { MapContainer } from "../../mapElements/MapContainer/MapContainer";
import "./NewRide.css";

// Page where a user can create a new ride
const NewRide = (props) => {
  const navigate = useNavigate();
  const { userID, accessToken } = useContext(AuthContext);
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [departureTime, setDepartureTime] = useState(new Date());
  const [timeChosen, setTimeChosen] = useState(false);
  const [role, setRole] = useState("passenger");
  const [isLoading, setIsLoading] = useState(false);
  const MapContainerWithLoader = withMapLoader(MapContainer);

  // Toggle between passenger and driver before creating a ride
  const toggleRole = () => {
    setRole(role === "passenger" ? "driver" : "passenger");
  };

  
  const handleConfirm = async (event) => {
    //prevent default form submission
    if (origin && destination) {
      setIsLoading(true);
      try {
        await newRide(
          role,
          userID,
          origin,
          destination,
          departureTime,
          accessToken
        );
        setIsLoading(false);
        alert("Ride created!");
        navigate("/ongoing");
      } catch (err) {
        setIsLoading(false);
        alert(err.message);
      }
    } else {
      alert("Please select an origin and destination");
    }
  };
  return (
    <div className="center">
      {isLoading && <LoadingSpinner asOverlay />}
      <Card className="ride-container">
        <ToggleButton
          option1="Passenger"
          option2="Driver"
          handleToggle={toggleRole}
        />
          <MapContainerWithLoader
            origin={origin}
            destination={destination}
            setOrigin={setOrigin}
            setDestination={setDestination}
            onOriginSelected={(origin) => setOrigin(origin)}
            onDestinationSelected={(destination) => setDestination(destination)}
            departureTime={departureTime}
            setDepartureTime={setDepartureTime}
            timeChosen={timeChosen}
            setTimeChosen={setTimeChosen}
          />
          <div className="button-container">
            <button
              className="confirm-button"
              onClick={handleConfirm}
            >
              Confirm
            </button>
          </div>
      </Card>
    </div>
  );
};

export default NewRide;
