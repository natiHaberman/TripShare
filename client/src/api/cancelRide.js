import axios from "axios";

export const cancelRide = async (rideID, userID, accessToken) => {
  try {
    const response = await axios.delete(
      `http://localhost:5000/rides/cancel`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
        data: { rideID, userID },
      }
    );
    return response;
  } catch (error) {
    throw new Error(error.response.data);
  }
};