import { createContext } from 'react';

export const AuthContext = createContext({
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  accessToken: "",
  setAccessToken: () => {},
  email: "",
  setEmail: () => {},
  login: () => {},
  logout: () => {},
});
