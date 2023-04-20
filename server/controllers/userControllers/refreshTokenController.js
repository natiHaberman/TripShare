const User = require("../../models/user");
const jwt = require("jsonwebtoken");
const HttpError = require("../../models/http-error");
require("dotenv").config();

const handleRefreshToken = async (req, res, next) => {
  // Checks if the JWT is in the cookie
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    const error = new HttpError("unauthorized, please log in.", 401);
    return next(error);
  }
  const refreshToken = cookies.jwt;
  // Checks if a user in the db has the JWT refresh token in the cookie
  const foundUser = await User.findOne({ refreshToken: refreshToken });
  if (!foundUser) return res.sendStatus(403);
  // Verifies the refresh token and signs a new access token
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundUser.email !== decoded.email) return res.sendStatus(403);
    const accessToken = jwt.sign(
      { email: decoded.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" }
    );
    res.json({ accessToken });
  });
};

module.exports = { handleRefreshToken };
