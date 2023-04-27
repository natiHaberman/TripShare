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
    return response;
  } catch (error) {
    throw new Error(error.response.data);
  }
};
