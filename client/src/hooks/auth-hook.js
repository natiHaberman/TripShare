import { useState, useEffect } from "react";
import axios from "axios";
import { checkTokenExpiration } from "../util/checkTokenExpiration";

export const useAuth = () => {
  const [accessToken, setAccessToken] = useState("");
  const [userID, setUserID] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);


  // Set access token and user ID in local storage and state upon first load
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (
      storedData &&
      storedData.accessToken &&
      !checkTokenExpiration(storedData.accessToken)
    ) {
      setAccessToken(storedData.accessToken);
      setUserID(storedData.userID);
      setIsLoggedIn(true);
    }
  }, []);

  // Every 5 minutes, if user is logged in, refresh access token and set in local storage and state
  useEffect(() => {
    let refreshInterval;
    refreshInterval = setInterval(() => {

      if (isLoggedIn) {
        (async () => {
          let newAccessToken;
          try {
            newAccessToken = await refresh();
            setAccessToken(newAccessToken);
            localStorage.setItem(
              "userData",
              JSON.stringify({
                userID: userID,
                accessToken: newAccessToken,
              })
            );
          } catch (err) {
            console.log(err);
            logout();
          }
        })();
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(refreshInterval);
  }, [accessToken]);

  // Login function that sets auth-context state and local storage
  const login = async (email, password) => {
    console.log(process.env.REACT_APP_BACKEND_URL);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/user/auth`,
        {
          email,
          password,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      // Set the access token, user ID, and logged in state
      setAccessToken(response.data.accessToken);
      setUserID(response.data.userID);
      setIsLoggedIn(true);

      // Save the access token and user ID to local storage
      localStorage.setItem(
        "userData",
        JSON.stringify({
          userID: response.data.userID,
          accessToken: response.data.accessToken,
        })
      );
    } catch (error) {
      throw new Error(
        "Login failed, please check your credentials and try again"
      );
    }
  };

  // Register function that calls login function after successful registration
  const register = async (email, password, username) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/user/register`,
        {
          email,
          password,
          username,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
    } catch (err) {
      console.log(err);
      throw new Error("Registration failed, please try again");
    }
    login(email, password);
  };

  // Logout function that clears auth-context state and local storage and redirects to login page
  const logout = async () => {
    try {
      await axios.get(`${process.env.REACT_APP_BACKEND_URL}/user/logout`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      setAccessToken("");
      setUserID("");
      setIsLoggedIn(false);
      // Remove the access token from local storage
      localStorage.removeItem("userData");
    } catch (error) {
      console.log(error);
    }
  };

  // Refresh function that renews the access token
  const refresh = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/user/refresh`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      return response.data.accessToken;
    } catch {
      throw new Error("Session expired, please log in to continue");
    }
  };

  // Return the values and functions you want to expose from the hook
  return {
    accessToken,
    userID,
    isLoggedIn,
    login,
    logout,
    register,
    refresh,
  };
};
