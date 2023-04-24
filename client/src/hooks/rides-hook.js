import { useState, useContext, useEffect } from "react";
import { findUser } from "../api/findUser";
import { fetchRides } from "../api//getRides";
import { AuthContext } from "../context/auth-context";

export const useRides = () => {
  const { accessToken, userID } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);
  const [rides, setRides] = useState([]);
  const [error, setError] = useState(null);
  useEffect(() => {
    fetchRidesData();
  }, []);

  const fetchRidesData = async () => {
    try {
      setIsLoading(true);
      const ridesData = await fetchRides(accessToken);
      const processedRides = await processRides(ridesData, accessToken, userID);
      setRides(processedRides);
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  return { isLoading, rides, error };
};

const processRides = async (rides, accessToken, userID) => {
  
  const ridesCopy = [...rides];
  const filteredRides = ridesCopy.filter(ride => {
    const uid = ride.driver ? ride.driver : ride.passenger;
    return uid !== userID;
  });

  const updatedRides = await Promise.all(
    filteredRides.map(async (ride) => {
      let role, uid;
      if (ride.driver) {
        role = "Driver";
        uid = ride.driver;
      } else {
        role = "Passenger";
        uid = ride.passenger;
      }
      const user = await findUser(uid, accessToken);
      return { ...ride, name: user.username, role: role, rating: user.rating };
    })
  );
  return updatedRides;
};
