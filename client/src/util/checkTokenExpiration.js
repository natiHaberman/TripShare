import jwtDecode from "jwt-decode";

export const checkTokenExpiration = (token) => {
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    console.log("token expiration", decoded.exp);
    console.log("current time", currentTime);
    return decoded.exp && decoded.exp < currentTime;
  } catch (error) {
    return false;
  }
};
