import { createContext } from 'react';

export const AuthContext = createContext({
  accessToken: "",
  setAccessToken: () => {},
  userID: "",
  setUserID: () => {},
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
});
