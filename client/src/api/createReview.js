import axios from "axios";

export const createReview = async (authorID, subjectID, rating, text, accessToken) => {
  try {
    console.log("authorID", authorID)
    console.log("subjectID", subjectID)
    console.log("rating", rating)
    console.log("text", text)
    const response = await axios.post(
      `http://localhost:5000/reviews/new`,
      { authorID, subjectID, rating, text },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      }
    );
  } catch (error) {
    console.log("Creating review failed:", error.response.data);
    throw new Error(error.response.data);
  }
};


