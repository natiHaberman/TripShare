import axios from "axios";

export const sendRequest = async (rideID, userID, accessToken) => {
  try {
    const response = await axios.post(
      `http://localhost:5000/requests/new`,
      { rideID, userID },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      }
    );
    console.log("sending request response", response);
    return response;
  } catch (error) {
    console.error("Sending request failed:", error);
  }
};
