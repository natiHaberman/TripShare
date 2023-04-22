import axios from "axios";

export const findUser = async (uid,accessToken) => {
    try {
      const response = await axios.get(`http://localhost:5000/user/find/${uid}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      });
      const user = response.data.user;
      return user;
    } catch (error) {
      console.error("Fetching user failed:", error);
    }
  };