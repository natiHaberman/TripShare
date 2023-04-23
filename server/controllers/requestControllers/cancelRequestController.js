const Ride = require("../../models/ride");
const User = require("../../models/user");
const Request = require("../../models/request");
const HttpError = require("../../models/http-error");

const handleCancelRequest = async (req, res, next) => {
  const { requestID, userID } = req.body;
  if (!requestID || !userID) {
    const error = new HttpError("userID and requestID are required.", 422);
    return next(error);
  }
  let request;
  try {
    request = await Request.findById(requestID);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find request.",
      500
    );
    return next(error);
  }
  if (!request) {
    const error = new HttpError("Could not find request for provided id.", 404);
    return next(error);
  }
  let user;
  try {
    user = await User.findById(userID);
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
  if (
    request.sender.toString() !== userID &&
    request.receiver.toString() !== userID
  ) {
    const error = new HttpError(
      "You are not authorized to cancel this request.",
      401
    );
    return next(error);
  }
  try {
    request.type = "canceled";
    await request.save();
  } catch (err) {
    const error = new HttpError(
      "Canceling request failed, please try again later.",
      500
    );
    return next(error);
  }
  res.status(200).json({ message: "Canceled request." });
};
module.exports = { handleCancelRequest };
