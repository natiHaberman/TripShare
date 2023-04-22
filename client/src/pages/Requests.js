import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/auth-context";
import Stars from "../UIElements/Stars";
import LoadingSpinner from "../UIElements/LoadingSpinner";
import { fetchRequests } from "../api/getRequests";
import Card from "../UIElements/Card";
import "./Requests.css";

const Requests = () => {
  const { userID, accessToken } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const newRequests = await fetchRequests(userID, accessToken);
      setRequests(newRequests);
      setIsLoading(false);
    })();
  }, [userID, accessToken]);

  return (
    <div className="requests-page">
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && requests?.length > 0 && (
        <ul className="requests-list">
          {requests.map((request, index) => (
            <li key={index} className="request-item">
              <div className="request-info">
                {/* Uncomment the following lines after fetching and adding the user data */}
                {/* <h3>{request.userData.username}</h3>
                <p>
                  Rating: <Stars rating={request.userData.rating} />
                </p>
                <p>Origin: {request.origin}</p>
                <p>Destination: {request.destination}</p>
                <p>Time: {request.time}</p> */}
                <h3>{request._id}</h3>
              </div>
            </li>
          ))}
        </ul>
      )}
      {!isLoading && (requests?.length === 0 || !requests?.length) && (
        <Card>
          <div className="empty-requests">
            <h3>No requests found.</h3>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Requests;
