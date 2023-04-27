import axios from "axios";

export const cancelRequest = async (requestID, userID, accessToken) => {
  try {
    const response = await axios.delete(
      `https://joy-ride.herokuapp.com/requests/cancel`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
        data: { requestID, userID }, 
      }
    );
    return response;
  } catch (error) {
    throw new Error(error.response.data);
  }
};