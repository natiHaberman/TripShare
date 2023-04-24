import React, { useState, useContext } from "react";
import Map from "../mapElements/Map";
import Card from "../UIElements/Card";
import LoadingSpinner from "../UIElements/LoadingSpinner";
import { cancelRide } from "../api/cancelRide";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/auth-hook";
import "./OngoingRide.css";
import { useRequests } from "../hooks/requests-hook";
import Modal from "../UIElements/Modal";

function OngoingRide() {
  const { ride } = useRequests();
  const [isLoading, setIsLoading] = useState(false);
  const { accessToken, userID } = useAuth();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const openCancelModal = () => {
    setShowModal(true);
  };

  const handleCancel = async () => {
    try {
      setIsLoading(true);
      console.log("ride", ride);
      const rideID = ride._id;
      console.log("rideID", rideID);
      console.log("userID", userID);
      const response = await cancelRide(rideID, userID, accessToken);
      alert("Ride canceled");
      console.log(response);
      setIsLoading(false);
      navigate("/");
    } catch (err) {
      setIsLoading(false);
      alert(err.message);
    }
  };
  return (
    <div className="center">
        {showModal && (
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

        )}
      <Card className="ride-container">
        {(!ride || isLoading) && <LoadingSpinner asOverlay />}
        {ride && (
          <React.Fragment>
            <div className="ride-info">
              <h2>Status: {ride.type}</h2>
              <p>Role: {ride.role}</p>
              <p>Origin: {ride.origin}</p>
              <p>Destination: {ride.destination}</p>
              <p>Departure Time: {ride.departureTime}</p>
              <p>Duration: {ride.duration}</p>
              <p>Distance: {ride.distance}</p>
              {ride.type === "ongoing" && (
                <>
                  {ride.role === "Driver" && <p>Passenger: {ride.passenger}</p>}
                  {ride.role === "Passenger" && <p>Driver: {ride.driver}</p>}
                </>
              )}
            </div>
            <Map origin={ride.origin} destination={ride.destination}></Map>
            {ride.type === "pending" && (
              <button className="cancel-button" onClick={openCancelModal}>
                Cancel Ride
              </button>
            )}
          </React.Fragment>
        )}
      </Card>
    </div>
  );
}

export default OngoingRide;
