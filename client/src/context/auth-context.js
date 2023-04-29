import { createContext } from 'react';

// Authorization context which is held application wide in order to provide access to the access token and user ID to all components
export const AuthContext = createContext({
  accessToken: "",
  setAccessToken: () => {},
  userID: "",
  setUserID: () => {},
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
});
