import axios from "axios";

export const deleteRequest = async (requestID, userID, accessToken) => {
  try {
    const response = await axios.delete(
      `http://localhost:5000/requests/delete`,
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
    console.error("Deleting request failed:", error);
  }
};