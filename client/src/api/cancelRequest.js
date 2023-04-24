import axios from "axios";

export const cancelRequest = async (requestID, userID, accessToken) => {
  try {
    const response = await axios.delete(
      `http://localhost:5000/requests/cancel`,
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