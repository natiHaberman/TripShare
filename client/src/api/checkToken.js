import jwtDecode from "jwt-decode";
import axios from "axios";

const refreshToken = async () => {
  try {
    const refreshToken = document.cookie.match(/jwt=([^;]+)/)?.[1];
    if (!refreshToken) {
      throw new Error("Refresh token not found in cookies.");
    }

    const response = await axios.get("http://localhost:5000/user/refresh", {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    localStorage.setItem(
      "userData",
      JSON.stringify({
        userID: response.data.userID,
        accessToken: response.data.accessToken,
      })
    );

    return response.data.accessToken;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const isTokenExpired = (token) => {
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    return decoded.exp && decoded.exp < currentTime;
  } catch (error) {
    return false;
  }
};

const customAxios = axios.create(); // Create a custom axios instance

customAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.log("access token expired");
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const storedData = JSON.parse(localStorage.getItem("userData"));
      const accessToken = storedData?.accessToken;

      if (accessToken && isTokenExpired(accessToken)) {
        const newAccessToken = await refreshToken();
        if (newAccessToken) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axios(originalRequest);
        }
      }
    }

    return Promise.reject(error);
  }
);

export { isTokenExpired, refreshToken, customAxios};
