import axios from "axios";

export const acceptRequest = async (requestID, userID, accessToken) => {
  try {
    const response = await axios.patch(
      `http://localhost:5000/requests/accept`,
      {requestID, userID},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      }
    );
    console.log(response);
    return response;
  } catch (error) {
    console.error("Accepting request failed:", error);
  }
};