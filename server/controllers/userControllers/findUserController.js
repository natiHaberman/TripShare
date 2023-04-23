const User = require("../../models/user");
const HttpError = require("../../models/http-error");

const handleFindUser = async (req, res, next) => {
  const userID = req.params.uid;

  if (!userID) {
    const error = new HttpError("User ID is required.", 422);
    return next(error);
  }
  let user;
  try {
    user = await User.findById(userID).select("-email -password");
  } catch {
    const error = new HttpError(
      "Something went wrong, could not find user.",
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError("Could not find user for provided id.", 404);
    return next(error);
  }

  res.status(200).json({ user: user.toObject({ getters: true }) });
};

module.exports = { handleFindUser };
