import axios from 'axios';
export const findUser = async (uid,accessToken) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/user/find/${uid}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      });
      const user = response.data.user;
      return user;
    } catch (error) {
      throw new Error(error.response.data);
    }
  };