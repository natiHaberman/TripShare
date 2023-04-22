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
    const response = await axios.post(
      `http://localhost:5000/rides/new`,
      { role, userID, origin, destination, departureTime },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      }
    );
    const ride = response.data.ride;
    return ride;
  } catch (error) {
    console.error("Creating ride failed:", error);
  }
};
