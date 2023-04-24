import axios from "axios";

export const fetchRequests = async (userID, accessToken) => {
  try {
    const uid = userID;
    const response = await axios.get(
      `http://localhost:5000/requests/index/${uid}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      }
    );
    const requests = response.data.requests;
    return requests;
  } catch (error) {
    throw new Error(error.response.data);
  }
};