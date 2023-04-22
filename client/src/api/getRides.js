import axios from "axios";
import {findUser} from "./findUser";

export const fetchRides = async (accessToken) => {
  try {
    const response = await axios.get(
      "http://localhost:5000/rides/all/pending",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      }
    );
    const rides = response.data.rides;
    return rides;
  } catch (error) {
    console.error("Fetching rides failed:", error);
  }
};

//for every ride in rides, get the user and add it to the ride object
export const processRides = async (rides, accessToken) => {
  const ridesCopy = [...rides];
  const updatedRides = await Promise.all(
    ridesCopy.map(async (ride) => {
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
