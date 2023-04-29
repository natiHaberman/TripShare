import jwtDecode from "jwt-decode";

export const checkTokenExpiration = (token) => {
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    console.log("time left:", decoded.exp - currentTime)
    return decoded.exp && decoded.exp < currentTime;
  } catch (error) {
    return false;
  }
};
