const Request = require("../../models/request");
const User = require("../../models/user");
const HttpError = require("../../models/http-error");

const handleGetRequests = async (req, res, next) => {
  const userID = req.params.uid;
  if (!userID) {
    const error = new HttpError("userID is required.", 422);
    return next(error);
  }
  let user;
  try {
    user = await User.findById(userID).populate("requests");
  } catch (err) {
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
  const requests = user.requests;
  res.json({
    requests: requests.map((request) => request.toObject({ getters: true })),  });
};

module.exports = { handleGetRequests };
