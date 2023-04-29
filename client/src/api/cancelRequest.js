import axios from 'axios';
export const cancelRequest = async (requestID, userID, accessToken) => {
  try {
    const response = await axios.delete(
      `${process.env.REACT_APP_BACKEND_URL}/requests/cancel`,
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