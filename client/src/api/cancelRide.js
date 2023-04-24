import axios from "axios";

export const cancelRide = async (rideID, userID, accessToken) => {
  console.log("accessToken", accessToken);
  console.log("rideID", rideID);
  console.log("userID", userID);
  try {
    const response = await axios.delete(
      `http://localhost:5000/rides/cancel`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
        data: { rideID, userID }, // Move rideID and userID inside the data property
      }
    );
    console.log(response);
    return response;
  } catch (error) {
    throw new Error(error.response.data);
  }
};