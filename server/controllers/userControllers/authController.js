const bcrypt = require("bcrypt");
const User = require("../../models/user"); // Import the User model
const jwt = require("jsonwebtoken");
const HttpError = require("../../models/http-error");
require("dotenv").config();

const handleLogin = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    const error = new HttpError("Username and password are required.", 422);
    return next(error);
  }
  try {
    // Find the user in the MongoDB database
    const foundUser = await User.findOne({ email: email });
    if (!foundUser) {
      const error = new HttpError("No user exists with that email.", 401);
      return next(error);
    }
    // Evaluate password
    const match = await bcrypt.compare(password, foundUser.password);

    if (match) {
      const userID = foundUser._id;
      const accessToken = jwt.sign(
        {
          userID: foundUser._id,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "5m" }
      );
      const refreshToken = jwt.sign(
        { userID: userID },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "20m" }
      );
      res.cookie("jwt", refreshToken, {
        httpOnly: true, sameSite: 'None', secure: true, maxAge: 20 * 60 * 1000,
      });
      foundUser.refreshToken = refreshToken;
      await foundUser.save();
      res.json({ accessToken, userID });
    } else {
      const error = new HttpError("Incorrect email or password", 401);
      return next(error);
    }
  } catch (err) {
    const error = new HttpError(
      "Logging in failed, please try again later.",
      500
    );
    return next(error);
  }
};

module.exports = { handleLogin };
