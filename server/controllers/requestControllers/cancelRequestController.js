const User = require("../../models/user");
const Request = require("../../models/request");
const HttpError = require("../../models/http-error");

const handleCancelRequest = async (req, res, next) => {

  // Returns error if body does not include required fields
  const { requestID, userID } = req.body;
  if (!requestID || !userID) {
    const error = new HttpError("userID and requestID are required.", 422);
    return next(error);
  }

  // Searches for request in database and returns error if fails
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

  // Returns error if request is not found
  if (!request) {
    const error = new HttpError("Could not find request for provided id.", 404);
    return next(error);
  }

  // Returns error if fails to fetch users
  let sender, recipient;
  try {
    sender = await User.findById(request.sender);
    recipient = await User.findById(request.recipient);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while fetching sender or recipient.",
      500
    );
    return next(error);
  }

  // Returns error if sender or recipient are not found
  if (!sender || !recipient) {
    const error = new HttpError(
      "Could not find sender or recipient.",
      404
    );
    return next(error);
  }

  // Returns error if user is not authorized to cancel request
  if (
    request.sender.toString() !== userID &&
    request.recipient.toString() !== userID
  ) {
    const error = new HttpError(
      "You are not authorized to cancel this request.",
      401
    );
    return next(error);
  }

  // Cancels request and returns error if fails
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
