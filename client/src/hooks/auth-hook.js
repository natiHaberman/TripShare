import { useState, useEffect } from "react";
import axios from "axios";

export const useAuth = () => {
  const [accessToken, setAccessToken] = useState("");
  const [userID, setUserID] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if access token is stored in local storage and set it in state if it is and set isLoggedIn to true
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (storedData && storedData.accessToken) {
      setAccessToken(storedData.accessToken);
      setUserID(storedData.userID);
      setIsLoggedIn(true);
    }
  }, []);

  // Login function that sets auth-context state and local storage
  const login =async (email, password) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/user/auth",
        {
          email,
          password,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

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
      throw new Error("Login failed, please check your credentials and try again");
    }
  };


  // Register function that calls login function after successful registration
  const register = async (email, password, username) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/user/register",
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
    }
    catch (err) {
      console.log(err);
      throw new Error("Registration failed, please try again");
    }
    login(email, password);
  };


  // Logout function that clears auth-context state and local storage and redirects to login page
  const logout = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/user/logout",
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
    setAccessToken("");
    setUserID("");
    setIsLoggedIn(false);
    // Remove the access token from local storage
    localStorage.removeItem("userData");
  }
  catch (error) {
    console.log(error);
  }
  };


  // Refresh function that renews the access token
  const refresh = async () => {
    try {
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
      setAccessToken(response);
    } catch {
      logout();
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
