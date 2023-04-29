import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/auth-context";
import { fetchRequests } from "../api/getRequests";
import { findUser } from "../api/findUser";
import { fetchRides } from "../api/getRides";
import { formatDateToTime } from "../util/formatDateToTime";

export const useRequests = () => {
  const { userID, accessToken } = useContext(AuthContext);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [acceptedRequests, setAcceptedRequests] = useState([]);
  const [canceledRequests, setCanceledRequests] = useState([]);
  const [rerenderFlag, setRerenderFlag] = useState(false);
  const [ride, setRide] = useState({});

  // Calls helper functions to fetch and sort data on mount and on rerender for requests and ongoing ride pages
  useEffect(() => {
    (async () => {
      let ridesData, requestData, userData;
      try {
        [ridesData, requestData, userData] = await fetchData();
        if (!ridesData || !requestData || !userData) {
          setRide({role: "none"}); // Used for page rendering when user doesn't have a ride
        }
      } catch (err) {
        setRide({role: "none"});
      }
      try{
        await setUserRide(ridesData, userData, userID);
      }
      catch(err){
        setRide({role: "none"});
      }
      let pending, accepted, canceled;
      try {
        [pending, accepted, canceled] = await sortData(
          ridesData,
          requestData,
          userData,
          accessToken
        );
      } catch (err) {
        setRide({role: "none"});
      }
      setPendingRequests(pending);
      setAcceptedRequests(accepted);
      setCanceledRequests(canceled);
    })();
  }, [userID, accessToken, rerenderFlag]);

  // Rerenders page when a request is accepted or canceled
  const rerender = () => {
    setRerenderFlag((prev) => !prev);
  };

  // Fetches the data and merges it into one array
  const fetchData = async () => {
    try {
      const pendingRidesData = await fetchRides(accessToken, "pending");
      const ongoingRidesData = await fetchRides(accessToken, "ongoing");
      const completedRidesData = await fetchRides(accessToken, "completed");
      const canceledRidesData = await fetchRides(accessToken, "canceled");
      const ridesData = [
        ...pendingRidesData,
        ...ongoingRidesData,
        ...completedRidesData,
        ...canceledRidesData,
      ];
      const requestData = await fetchRequests(userID, accessToken);
      const userData = await findUser(userID, accessToken);
      return [ridesData, requestData, userData];
    } catch (err) {
      return [null, null, null];
    }
  };

  // Sets user's ride data
  const setUserRide = async (ridesData, userData, userID) => {

    // Finds ride associated with user to display on ongoing ride and requests page.
    const ride = ridesData.find((r) => r._id === userData.ride);
    if (!ride){
      throw new Error("No user ride");
    }
    let role;

    // Sets user's role in ride
    if (ride.passenger === userID) role = "Passenger";
    else if (ride.driver === userID) role = "Driver";
    else return;

    // Finds other user's data
    let otherUser, otherUserID;
    if (ride.type === "ongoing") {
      if (role === "Passenger") otherUserID = ride.driver;
      else otherUserID = ride.passenger;
      try {
        otherUser = await findUser(otherUserID, accessToken);
      } catch (err) {
        throw new Error("Error finding other user");
      }
    }

    // Merges ride data into one object
    const rideData = {
      _id: ride._id,
      origin: ride.origin,
      destination: ride.destination,
      role,
      duration: ride.duration,
      distance: ride.distance,
      departureTime: formatDateToTime(ride.departureTime),
      type: ride.type,
    };
    if (ride.type === "ongoing") {
      rideData.username = otherUser.username;
      rideData.rating = otherUser.rating;
      rideData.userID = otherUserID;
    }
    setRide(rideData);
  };

  // Merges and sorts data into three arrays based on request status
  const sortData = async (ridesData, requestData, userData, accessToken) => {
    const pending = [];
    const accepted = [];
    const canceled = [];
    for (const request of requestData) {

      // finds ride associated with request and continues if it doesn't exist
      const ride = ridesData.find((r) => r._id === request.ride);
      if (!ride) continue;

      // Sets user's role in ride
      let rideRole;
      if (ride.passenger === userID) rideRole = "Passenger";
      else if (ride.driver === userID) rideRole = "Driver";
      else if (!ride.passenger) rideRole = "Driver";
      else rideRole = "Passenger";

      // Sets other user's role in request in order to retrieve their data
      let requestRole;
      if (request.sender === userID) requestRole = "recipient";
      else if (request.recipient === userID) requestRole = "sender";
      else continue;

      // Gets other user's data
      let otherUser;
      try {
        otherUser = await findUser(request[requestRole], accessToken);
      } catch (err) {
        continue;
      }

      // Sets request data to be displayed on page
      const requestData = {
        _id: request._id,
        origin: ride.origin,
        destination: ride.destination,
        rating: otherUser.rating,
        role: rideRole,
        username: otherUser.username,
        duration: ride.duration,
        distance: ride.distance,
        departureTime: formatDateToTime(ride.departureTime),
        status: request.type,
        recipient: request.recipient,
        sender: request.sender,
      };

      // Sorts requests by status
      if (request.type === "pending") {
        pending.push(requestData);
      } else if (request.type === "accepted") {
        accepted.push(requestData);
      } else if (request.type === "canceled") {
        canceled.push(requestData);
      }
    }

    return [pending, accepted, canceled];
  };

  return {
    ride,
    pendingRequests,
    acceptedRequests,
    canceledRequests,
    rerender,
  };
};
