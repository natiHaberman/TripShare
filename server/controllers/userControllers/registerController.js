const bcrypt = require("bcrypt");
const HttpError = require("../../models/http-error");
const User = require("../../models/user");

const handleNewUser = async (req, res, next) => {
  const { username, email, password } = req.body;
  if (!username || !password || !email) {
    const error = new HttpError(
      "Username, email and password are required.",
      422
    );
    return next(error);
  }
  // Check for duplicate usernames in the db
  const duplicate = await User.findOne({ email: email }).exec();
  if (duplicate) {
    const error = new HttpError("Email is already registered", 409);
    return next(error); //Conflict
  }
  try {
    // Encrypts the password
    const hashedPwd = await bcrypt.hash(password, 10);

    // Creates and stores the new user
    const result = await User.create({
      username: username,
      email: email,
      password: hashedPwd,
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
