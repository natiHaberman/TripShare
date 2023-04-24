import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/auth-context";
import { fetchRequests } from "../api/getRequests";
import { findUser } from "../api/findUser";
import { fetchRides } from "../api/getRides";

export const useRequests = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userID, accessToken } = useContext(AuthContext);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [acceptedRequests, setAcceptedRequests] = useState([]);
  const [canceledRequests, setCanceledRequests] = useState([]);
  const [ride, setRide] = useState({});

  useEffect(() => {
    (async () => {
      const [ridesData, requestData, userData] = await fetchData(); // Add await here
      setUserRide(ridesData, userData, userID);
      const [pending, accepted, canceled] = await sortData(
        ridesData,
        requestData,
        userData,
        accessToken
      );
      // Set state for each array
      setPendingRequests(pending);
      setAcceptedRequests(accepted);
      setCanceledRequests(canceled);
    })();
  }, [userID, accessToken]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const ridesData = await fetchRides(accessToken);
      const requestData = await fetchRequests(userID, accessToken);
      const userData = await findUser(userID, accessToken);
      setIsLoading(false);
      return [ridesData, requestData, userData];
    } catch (err) {
      setError(err.message);
    }
  };

  const setUserRide = (ridesData, userData, userID) => {
    const ride = ridesData.find((r) => r._id === userData.ride);
    if (!ride) return
    const role = ride.passenger === userID ? "Passenger" : "Driver";
    
    const rideData = {
      _id: ride._id,
      origin: ride.origin,
      destination: ride.destination,
      role,
      duration: ride.duration,
      distance: ride.distance,
      departureTime: ride.departureTime,
      type: ride.type,
    };
    setRide(rideData);
  };

  const sortData = async (ridesData, requestData, userData, accessToken) => {
    if (!ridesData || !userData) {
      return;
    }
    try {
      const pending = [];
      const accepted = [];
      const canceled = [];
      for (const request of requestData) {
        const ride = ridesData.find((r) => r._id === request.ride);
        let rideRole, requestRole;
        ride.passenger === userID
          ? (rideRole = "Driver")
          : (rideRole = "Passenger");
        request.sender === userID
          ? (requestRole = "recipient")
          : (requestRole = "sender");
        const otherUser = await findUser(request[requestRole], accessToken);
        const requestData = {
          _id: request._id,
          origin: ride.origin,
          destination: ride.destination,
          rating: otherUser.rating,
          role: rideRole,
          username: otherUser.username,
          duration: ride.duration,
          distance: ride.distance,
          departureTime: ride.departureTime,
          status: request.type,
          recipient: request.recipient,
        };

        if (request.type === "pending") {
          pending.push(requestData);
        } else if (request.type === "accepted") {
          accepted.push(requestData);
        } else if (request.type === "canceled") {
          canceled.push(requestData);
        }
      }
      console.log("pendingRequests", pending);
      console.log("acceptedRequests", accepted);
      console.log("canceledRequests", canceled);
      return [pending, accepted, canceled];
    } catch (err) {
      console.log(err.message);
      setError(err.message);
      return;
    }
  };

  return {
    ride,
    pendingRequests,
    acceptedRequests,
    canceledRequests,
    isLoading,
  };
};
