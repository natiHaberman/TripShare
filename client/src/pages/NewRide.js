import React, { useState, useContext } from "react";
import Card from "../UIElements/Card";
import LoadingSpinner from "../UIElements/LoadingSpinner";
import { MapContainer } from "../mapElements/MapContainer";
import { withMapLoader } from "../mapElements/withMapLoader";
import ToggleButton from "../UIElements/ToggleButton";
import { AuthContext } from "../context/auth-context";
import { newRide } from "../api/newRide";
import { useNavigate } from "react-router-dom";
import "./NewRide.css";

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

  const toggleRole = () => {
    setRole(role === "passenger" ? "driver" : "passenger");
  };

  const handleConfirm = async (event) => {
    //prevent default form submission
    event.preventDefault();
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
        <form
          className="map-container"
          onSubmit={(event) => event.preventDefault()}
        >
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
              onClick={(event) => handleConfirm(event)}
            >
              Confirm
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default NewRide;
