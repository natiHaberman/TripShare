import axios from "axios";

export const newRide = async (
  role,
  userID,
  origin,
  destination,
  departureTime,
  accessToken
) => {
  try {
    await axios.post(
      `https://joy-ride.herokuapp.com/rides/new`,
      { role, userID, origin, destination, departureTime },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      }
    );
  } catch (error) {
    throw new Error(error.response.data);
  }
};
