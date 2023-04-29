import axios from 'axios';

export const acceptRequest = async (requestID, userID, accessToken) => {
  try {
    const response = await axios.patch(
      `${process.env.REACT_APP_BACKEND_URL}/requests/accept`,
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
