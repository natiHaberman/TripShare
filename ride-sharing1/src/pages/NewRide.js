import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Modal from "../UIElements/Modal";
import DatePicker from "../UIElements/DatePicker";
import Card from "../UIElements/Card";
import Map from "../UIElements/Map";
import MapInput from "../UIElements/MapInput";
import ToggleButton from "../UIElements/ToggleButton";
import { useEffect } from "react";
import "./NewRide.css";

const NewRide = (props) => {
  const ACCOMPANIED_PASSENGER = "Accompanied Passenger";
  const ACCOMPANIED_DRIVER = "Accompanied Driver";
  const SOLO_PASSENGER = "Solo Passenger";
  const SOLO_DRIVER = "Solo Driver";

  const [role, setRole] = useState(SOLO_PASSENGER);
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [routeConfirmed, setRouteConfirmed] = useState(false);
  const [departureTime, setDepartureTime] = useState(new Date());
  const [timeChosen, setTimeChosen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // when navigating from rides
  const path = useLocation();
  let ride = null;
  useEffect(() => {
    ride = path?.state;
  }, []);

  useEffect(() => {
    if (ride?.role === "Passenger") {
      setRole(ACCOMPANIED_DRIVER);
      setRouteConfirmed(true);
    } else if (ride?.role === "Driver") {
      setRole(ACCOMPANIED_PASSENGER);
      setRouteConfirmed(true);
    }
  }, [ride]);

  const toggleRole = () => {
    setRole(role === SOLO_PASSENGER ? SOLO_DRIVER : SOLO_PASSENGER);
  };

  const handleConfirm = () => {
    if (origin && destination) {
      setRouteConfirmed(true);
    } else {
      //show error message
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
        {routeConfirmed &&
          (() => {
            switch (role) {
              case ACCOMPANIED_DRIVER:
                return <h4>Leaving in 10 minutes, picking up {ride?.name}</h4>;
              case ACCOMPANIED_PASSENGER:
                return (
                  <h4>
                    Leaving in 10 minutes, waiting on pick up from {ride?.name}
                  </h4>
                );
              case SOLO_DRIVER:
                return <h4>Leaving in 10 minutes</h4>;
              default:
                return <h4>Waiting...</h4>;
            }
          })()}
        {!routeConfirmed && (
          <div className="input-container">
            <MapInput
              placeholder={"Choose starting point"}
              value={origin}
              setValue={setOrigin}
            />
            <MapInput
              placeholder={"Choose destination"}
              value={destination}
              setValue={setDestination}
            />

            {role && (
              <DatePicker
                className={`departure-time${
                  timeChosen ? " departure-time-selected" : ""
                }`}
                onChange={(date) => {
                  setDepartureTime(date);
                  setTimeChosen(true);
                }}
                departureTime={departureTime}
              />
            )}
          </div>
        )}
        <Map className="map" start={origin} destination={destination} />
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
