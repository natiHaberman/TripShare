import React, { useContext } from "react";
import Stars from "../UIElements/Stars";
import LoadingSpinner from "../UIElements/LoadingSpinner";
import { useRequests } from "../hooks/requests-hook";
import { acceptRequest } from "../api/acceptRequest";
import { cancelRequest } from "../api/cancelRequest";
import { AuthContext } from "../context/auth-context";
import { useNavigate } from "react-router-dom";
import "./Requests.css";

const Requests = () => {
  const {
    isLoading,
    ride,
    pendingRequests,
    acceptedRequests,
    canceledRequests,
  } = useRequests();
  const navigate = useNavigate();
  const { userID, accessToken } = useContext(AuthContext);


  const handleAcceptRequest = async (requestID, userID, accessToken) => {
    try {
      await acceptRequest(requestID, userID, accessToken); 
      alert("Request accepted");
    } catch (error) {
      alert("Error accepting request:", error);
    }
  };

  const handleCancelRequest = async (requestID, userID, accessToken) => {
    try {
      await cancelRequest(requestID, userID, accessToken); 
      alert("Request canceled");
    } catch (error) {
      alert("Error cancelling request")
    }
  };

  return (
    <div className="requests-page">
      {isLoading && (
        <div className="center">
          <LoadingSpinner asOverlay />
        </div>
      )}
      {ride?._id && (
        <div>
          <h2>Your Ride</h2>
          <div className="request-item">
            <div className="request-info">
              <p>Role: {ride.role}</p>
              <p>Origin: {ride.origin}</p>
              <p>Destination: {ride.destination}</p>
              <p>Duration: {ride.duration}</p>
              <p>Distance: {ride.distance}</p>
              <p>Departure Time: {ride.departureTime}</p>
            </div>
            <button
              onClick={() => {
                navigate("/ongoing");
              }}
              className="navigate-button"
            >
              Navigate
            </button>
          </div>
        </div>
      )}

      <h2>Pending Requests</h2>
      {pendingRequests.length > 0 ? (
        <ul className="requests-list">
          {pendingRequests.map((request, index) => (
            <li key={index} className="request-item">
              <div className="request-info">
                <p>Username: {request.username}</p>
                <p>Role: {request.role}</p>
                <p>Origin: {request.origin}</p>
                <p>Destination: {request.destination}</p>
                <p>
                  Rating: <Stars rating={request.rating} />
                </p>
                <p>Duration: {request.duration}</p>
                <p>Distance: {request.distance}</p>
                <p>Departure Time: {request.departureTime}</p>
              </div>
              {request.recipient===userID && (<div className="button-container">
              <button
                className="confirm-button"
                onClick={() =>
                  handleAcceptRequest(request._id, userID, accessToken)
                }
              >
                Accept
              </button>
              <button
                className="cancel-button"
                onClick={() =>
                  handleCancelRequest(request._id, userID, accessToken)
                }
              >
                cancel
              </button>
              </div>)}
            </li>
          ))}
        </ul>
      ) : (
        <div className="request-item">
        <p>No pending requests found.</p>
        </div>
      )}

      <h2>Accepted Requests</h2>
      {acceptedRequests.length > 0 ? (
        <ul className="requests-list">
          {acceptedRequests.map((request, index) => (
            <li key={index} className="request-item">
              <div className="request-info">
                <p>Role: {request.role}</p>
                <p>Origin: {request.origin}</p>
                <p>Destination: {request.destination}</p>
                <p>
                  Rating: <Stars rating={request.rating} />
                </p>
                <p>Duration: {request.duration}</p>
                <p>Distance: {request.distance}</p>
                <p>Departure Time: {request.departureTime}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="request-item">
        <p>No accepted requests found.</p>
        </div>
      )}

      <h2>Canceled Requests</h2>
      {canceledRequests.length > 0 ? (
        <ul className="requests-list">
          {canceledRequests.map((request, index) => (
            <li key={index} className="request-item">
              <div className="request-info">
                <p>Role: {request.role}</p>
                <p>Origin: {request.origin}</p>
                <p>Destination: {request.destination}</p>
                <p>
                  Rating: <Stars rating={request.rating} />
                </p>
                <p>Duration: {request.duration}</p>
                <p>Distance: {request.distance}</p>
                <p>Departure Time: {request.departureTime}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="request-item">
        <p>No canceled requests found.</p>
        </div>
      )}
    </div>
  );
};

export default Requests;
