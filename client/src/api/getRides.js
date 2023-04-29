import axios from 'axios';
export const fetchRides = async (accessToken, type) => {
  console.log();
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/rides/all/${type}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      }
    );
    const rides = response.data.rides;
    return rides;
  } catch (error) {
      throw new Error(error.response.data);
  }
};