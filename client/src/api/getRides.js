import axios from "axios";

export const fetchRides = async (accessToken) => {
  try {
    const response = await axios.get(
      "http://localhost:5000/rides/all/pending",
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