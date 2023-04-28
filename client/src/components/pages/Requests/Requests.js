import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRequests } from "../../../hooks/requests-hook";
import { acceptRequest } from "../../../api/acceptRequest";
import { cancelRequest } from "../../../api/cancelRequest";
import { AuthContext } from "../../../context/auth-context";
import Stars from "../../UIElements/Stars";
import LoadingSpinner from "../../UIElements/LoadingSpinner/LoadingSpinner";
import "./Requests.css";

const Requests = () => {
  const navigate = useNavigate();
  const {
    ride,
    pendingRequests,
    acceptedRequests,
    canceledRequests,
    rerender,
  } = useRequests();
  const { userID, accessToken } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);

  // Accept request
  const handleAcceptRequest = async (requestID, userID, accessToken) => {
    try {
      setIsLoading(true);
      await acceptRequest(requestID, userID, accessToken);
      alert("Request accepted");
      setIsLoading(false);
      rerender();
    } catch (error) {
      setIsLoading(false);
      alert("Error accepting request:", error);
    }
  };

  // Cancel request
  const handleCancelRequest = async (requestID, userID, accessToken) => {
    try {
      setIsLoading(true);
      await cancelRequest(requestID, userID, accessToken);
      setIsLoading(false);
      alert("Request canceled");
      rerender();
    } catch (error) {
      setIsLoading(false);
      alert("Error cancelling request");
    }
  };

  return (
    <div className="requests-container">
      {(isLoading || !ride?.role) && <LoadingSpinner asOverlay />}
      {ride?._id && (
        <div>
          <h2>Your Ride:</h2>
          <div className="user-ride-item">
            <div className="ride-info">
              <p>Role: {ride.role}</p>
              <p>Origin: {ride.origin}</p>
              <p>Destination: {ride.destination}</p>
              <p>Duration: {ride.duration}</p>
              <p>Distance: {ride.distance}</p>
              <p>Departure Time: {ride.departureTime}</p>
            </div>
            <div className="button-container">
              <button
                onClick={() => {
                  navigate("/ongoing");
                }}
                className="confirm-button"
              >
                Navigate
              </button>
            </div>
          </div>
        </div>
      )}

      <h2>Pending Requests:</h2>
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
              <div className="button-container">
                {request.recipient === userID && (
                  <button
                    className="confirm-button"
                    onClick={() =>
                      handleAcceptRequest(request._id, userID, accessToken)
                    }
                  >
                    Accept
                  </button>
                )}
                <button
                  className="cancel-button"
                  onClick={() =>
                    handleCancelRequest(request._id, userID, accessToken)
                  }
                >
                  cancel
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="empty-message">
          <p>No pending requests found.</p>
        </div>
      )}

      <h2>Accepted Requests:</h2>
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
        <div className="empty-message">
          <p>No accepted requests found.</p>
        </div>
      )}

      <h2>Canceled Requests:</h2>
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
        <div className="empty-message">
          <p>No canceled requests found.</p>
        </div>
      )}
    </div>
  );
};

export default Requests;
