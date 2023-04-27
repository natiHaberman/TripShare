import axios from "axios";

export const fetchRides = async (accessToken, type) => {
  try {
    const response = await axios.get(
      `https://joy-ride.herokuapp.com/rides/all/${type}`,
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