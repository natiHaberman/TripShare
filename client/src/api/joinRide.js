import axios from "axios";

export const joinRide = async (rideID, userID, accessToken) => {
  try {
    const response = await axios.patch(
      `http://localhost:5000/rides/join`,
      {
        rideID,
        userID
      },
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
    console.error("Joining ride failed:", error);
  }
}