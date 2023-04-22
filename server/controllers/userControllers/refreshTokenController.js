const User = require("../../models/user");
const jwt = require("jsonwebtoken");
const HttpError = require("../../models/http-error");
require("dotenv").config();

const handleRefreshToken = async (req, res, next) => {
  // Checks if the JWT is in the cookie
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    const error = new HttpError("Cookie has expired, please log in", 401);
    return next(error);
  }
  const refreshToken = cookies.jwt;
  // Checks if a user in the db has the JWT refresh token in the cookie
  const foundUser = await User.findOne({ refreshToken: refreshToken });
  if (!foundUser) {
    const error = new HttpError("Couldn't find user, please log in Again",401);
  }
  // Verifies the refresh token and signs a new access token
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundUser._id.toString() !== decoded.userID) {
      const error = new HttpError("Wrong credentials.", 403);
      return next(error);
    }
    const accessToken = jwt.sign(
      { userID: decoded.userID },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "5m" }
    );
    res.json({ accessToken });
  });
};

module.exports = { handleRefreshToken };
