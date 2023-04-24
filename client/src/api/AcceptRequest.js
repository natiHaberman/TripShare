import axios from "axios";

export const acceptRequest = async (requestID, userID, accessToken) => {
  try {
    const response = await axios.patch(
      `http://localhost:5000/requests/accept`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
        data: { requestID, userID },
      }
    );
    console.log(response);
    return response;
  } catch (error) {
    throw new Error(error.response.data);
  }
};
