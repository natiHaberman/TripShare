import React, { useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import Modal from "../UIElements/Modal";
import DatePicker from "../UIElements/DatePicker";
import Card from "../UIElements/Card";
import { MapContainer } from "../mapElements/MapContainer";
import ToggleButton from "../UIElements/ToggleButton";
import { useEffect } from "react";
import { AuthContext } from "../context/auth-context";
import { newRide } from "../api/newRide";
import "./NewRide.css";

const NewRide = (props) => {
  const { userID, accessToken } = useContext(AuthContext);

  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [routeConfirmed, setRouteConfirmed] = useState(false);
  const [departureTime, setDepartureTime] = useState(new Date());
  const [timeChosen, setTimeChosen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [role, setRole] = useState("passenger");

  // when navigating from rides
  const path = useLocation();
  let ride = null;
  useEffect(() => {
    ride = path?.state?.ride;
  }, []);

  const toggleRole = () => {
    setRole(role === "passenger" ? "driver" : "passenger");
  };

  const handleConfirm = async () => {
    if (origin && destination) {
      try {
        const response = await newRide(
          role,
          userID,
          origin,
          destination,
          departureTime,
          accessToken
        );
        const responseData = await response.json();
        console.log(responseData);
        if (!response.ok) {
          throw new Error(responseData.message);
        }
        setRouteConfirmed(true);
      } catch (err) {
        console.log(err);
      }
    } else {
      alert("Please select an origin and destination");
    }
  };

  const handleCancel = () => {
    setRouteConfirmed(false);
    setOrigin("");
    setDestination("");
    setTimeChosen(false);
  };

  return (
    <div className="center">
      <Card>
        <Modal
          show={showModal}
          onCancel={() => setShowModal(false)}
          header="Cancel Ride"
          footer={
            <div className="modal-options">
              <button
                className="modal-confirm-button"
                onClick={() => {
                  setShowModal(false);
                  handleCancel();
                }}
              >
                Contine
              </button>
              <button
                className="modal-cancel-button"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          }
        >
          <p>Are you sure yoo want to cancel your ride?</p>
        </Modal>
        
        <ToggleButton
          option1="Passenger"
          option2="Driver"
          handleToggle={toggleRole}
        />

        <div className="map-container">
          <MapContainer
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
        </div>
        <div className="button-container">
          {routeConfirmed ? (
            <button
              className="cancel-button"
              onClick={() => setShowModal(true)}
            >
              Cancel
            </button>
          ) : (
            <button className="confirm-button" onClick={handleConfirm}>
              Confirm
            </button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default NewRide;
