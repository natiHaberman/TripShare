const User = require("../../models/user");
const HttpError = require("../../models/http-error");

const handleUpdateUser = async (req, res, next) => {
  // Checks if request body has required fields
  const { userID, updateProperty, updateData } = req.body;
  if (!userID) {
    const error = new HttpError(
      "user ID, update property and data are required.",
      422
    );
    return next(error);
  }

  // Returns error if fetching user fails
  let user;
  try {
    user = await User.findById(userID);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update user.",
      500
    );
    return next(error);
  }

  // Returns error if user is not found
  if (!user) {
    const error = new HttpError("Could not find user for this id.", 404);
    return next(error);
  }

  // Updates user and returns updated user
  try {
    user[updateProperty] = updateData;
    user.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update user.",
      500
    );
    return next(error);
  }

  res.status(200).json({ user: user.toObject({ getters: true }) });
};

module.exports = { handleUpdateUser };
