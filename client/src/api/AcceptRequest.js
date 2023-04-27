import axios from "axios";

export const acceptRequest = async (requestID, userID, accessToken) => {
  try {
    const response = await axios.patch(
      `http://localhost:5000/requests/accept`,
      {requestID, userID },
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
