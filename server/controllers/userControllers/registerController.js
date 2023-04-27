const bcrypt = require("bcrypt");
const HttpError = require("../../models/http-error");
const User = require("../../models/user");

const handleNewUser = async (req, res, next) => {
  // Checks if the request body has the required fields
  const { username, email, password } = req.body;
  if (!username || !password || !email) {
    const error = new HttpError(
      "Username, email and password are required.",
      422
    );
    return next(error);
  }

  // Retrieves the user from the database and returns an error if it fails
  let duplicate;
  try {
    duplicate = await User.findOne({ email: email }).exec();
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }

  // Checks if the user already exists and returns an error if it does
  if (duplicate) {
    const error = new HttpError("Email is already registered", 409);
    return next(error); //Conflict
  }

  // Creates the new user and returns an error if it fails
  try {

    // Encrypts the password
    const hashedPwd = await bcrypt.hash(password, 10);

    // Creates and stores the new user
    const result = await User.create({
      username: username,
      email: email,
      password: hashedPwd,
      rating: 0,
      requests: [],
      reviews: [],
      ride: null,
      refreshToken: "",
      ridesTaken: 0,
      ridesGiven: 0,
      model: "Tesla Model 3"
    });

    res.status(201).json({ success: `New user ${username} created!` });
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }
};

module.exports = { handleNewUser };
