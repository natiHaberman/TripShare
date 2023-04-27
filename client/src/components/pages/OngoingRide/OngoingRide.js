import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cancelRide } from "../../../api/cancelRide";
import { completeRide } from "../../../api/completeRide";
import { createReview } from "../../../api/createReview";
import { useAuth } from "../../../hooks/auth-hook";
import { useRequests } from "../../../hooks/requests-hook";
import { withMapLoader } from "../../mapElements/withMapLoader";
import Map from "../../mapElements/Map";
import Card from "../../UIElements/Card/Card";
import LoadingSpinner from "../../UIElements/LoadingSpinner/LoadingSpinner";
import ConfirmModal from "./ConfirmModal";
import CancelModal from "./CancelModal";
import "./OngoingRide.css";

// Page where a user can see their ongoing ride and cancel or complete it
function OngoingRide() {
  const { ride } = useRequests();
  const [isLoading, setIsLoading] = useState(false);
  const { accessToken, userID } = useAuth();
  const navigate = useNavigate();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const MapWithLoader = withMapLoader(Map);

  const openCancelModal = () => {
    setShowCancelModal(true);
  };

  const openFinishModal = () => {
    setShowFinishModal(true);
  };

  // Cancel ride
  const handleCancel = async () => {
    try {
      setIsLoading(true);
      const rideID = ride._id;
      await cancelRide(rideID, userID, accessToken);
      alert("Ride canceled");
      setIsLoading(false);
      navigate("/");
    } catch (err) {
      setIsLoading(false);
      alert(err.message);
    }
  };

  // Complete ride
  const handleFinish = async (rating, review) => {
    try {
      setIsLoading(true);
      const rideID = ride._id;
      completeRide(rideID, userID, accessToken);
      navigate("/");
    } catch (err) {
      setIsLoading(false);
      alert(err.message);
    }
    try {
      //(authorID, subjectID, rating, text, accessToken)
      const authorID = userID;
      const subjectID = ride.userID;
      const text = review;

      await createReview(
        authorID,
        subjectID,
        rating,
        text,
        accessToken
      );
      setIsLoading(false);
      alert("Ride finished");
    } catch (err) {
      setIsLoading(false);
      alert(err.message);
    }
  };

  return (
    <div className="center">
      {showCancelModal && (
        <CancelModal
          show={showCancelModal}
          onCancel={() => setShowCancelModal(false)}
          onConfirm={() => {
            setShowCancelModal(false);
            handleCancel();
          }}
        />
      )}
      {showFinishModal && (
        <ConfirmModal
          show={showFinishModal}
          onCancel={() => setShowFinishModal(false)}
          onConfirm={(rating, review) => {
            setShowFinishModal(false);
            handleFinish(rating, review);
          }}
          rating={rating}
          onRatingChange={(newRating) => setRating(newRating)}
          review={review}
          onReviewChange={(e) => setReview(e.target.value)}
        />
      )}{" "}
      <Card className="ongoing-ride-container">
        {(!ride.type || isLoading) && <LoadingSpinner asOverlay />}
        {ride && (
          <React.Fragment>
            <div className="ride-info">
              <h2>Status: {ride.type}</h2>
              <p>Your role: {ride.role}</p>
              <p>Origin: {ride.origin}</p>
              <p>Destination: {ride.destination}</p>
              <p>Departure Time: {ride.departureTime}</p>
              <p>Duration: {ride.duration}</p>
              <p>Distance: {ride.distance}</p>
              {ride.type === "ongoing" && (
                <>
                  {ride.role === "Driver" && <p>Passenger: {ride.username}</p>}
                  {ride.role === "Passenger" && <p>Driver: {ride.username}</p>}
                </>
              )}
            </div>
            <MapWithLoader
              origin={ride.origin}
              destination={ride.destination}
            ></MapWithLoader>
            <div className="button-container">
              {(ride.type === "pending" || ride.type === "ongoing") && (
                <button className="cancel-button" onClick={openCancelModal}>
                  Cancel Ride
                </button>
              )}
              {ride.type === "ongoing" && (
                <button
                  onClick={() => openFinishModal()}
                  className="confirm-button"
                >
                  Finish Ride
                </button>
              )}
            </div>
          </React.Fragment>
        )}
      </Card>
    </div>
  );
}

export default OngoingRide;
