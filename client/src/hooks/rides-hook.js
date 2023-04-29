import { useState, useContext, useEffect } from "react";
import { findUser } from "../api/findUser";
import { fetchRides } from "../api//getRides";
import { AuthContext } from "../context/auth-context";
import { formatDateToTime } from "../util/formatDateToTime";

export const useRides = () => {
  const { accessToken, userID } = useContext(AuthContext);
  const [rides, setRides] = useState([]);

  // Fetches and processes rides on mount using async functions below
  useEffect(() => {
    const asyncFunc = async () => {
    try {
      const ridesData = await fetchAndProcessRides();
      setRides(ridesData);
    } catch (error) {
      throw new Error(error.message);
    }
  };
  asyncFunc();
  }, [accessToken, userID]);

  // Function to fetch rides from API and process them
  const fetchAndProcessRides = async () => {
    let ridesData;
    try {
      const type = "pending";
      ridesData = await fetchRides(accessToken, type );
    } catch (error) {
      throw new Error(error.message);
    }
    const filteredRides = filterRides(ridesData, userID);
    let processedRides;
    try {
      processedRides = await processRides(filteredRides, accessToken, userID);
      return processedRides;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  // The rides page that uses this function needs only the rides the user is not a part of so they can join them
  // This function filters out the rides the user is a part of
  const filterRides = (ridesCopy, userID) =>
    ridesCopy.filter((ride) => {
      return userID !== ride.driver && userID !== ride.passenger;
    });

  // Merges the ride data with the user data of the ride creator with the ride data to to concentrate all the data in one object
  const processRides = async (rides, accessToken) => {
    const ridesCopy = [...rides];
    let updatedRides;
    try {
      updatedRides = await Promise.all(
        ridesCopy.map(async (ride) => {
          let role, uid;
          if (ride.driver) {
            role = "Driver";
            uid = ride.driver;
          } else {
            role = "Passenger";
            uid = ride.passenger;
          }
          try {
            const rideUser = await findUser(uid, accessToken);
            return {
              ...ride,
              username: rideUser.username,
              rating: rideUser.rating,
              role: role,
              rating: rideUser.rating,
              departureTime: formatDateToTime(ride.departureTime),
            };
          } catch (error) {
            console.error(
              `Error processing ride with uid ${uid}: ${error.message}`
            );
            return ride;
          }
        })
      );
    } catch (error) {
      throw new Error(error.message);
    }
    return updatedRides;
  };

  return rides;
};
