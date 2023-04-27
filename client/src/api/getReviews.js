import axios from "axios";

export const fetchReviews = async (accessToken, uid, type) => {
  try {
    const response = await axios.get(
      `https://joy-ride.herokuapp.com/reviews/all/${uid}/${type}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      }
    );
    const reviews = response.data.reviews;
    return reviews;
  } catch (error) {
      throw new Error(error.response.data);
  }
};