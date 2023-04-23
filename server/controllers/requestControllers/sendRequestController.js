const Ride = require("../../models/ride");
const User = require("../../models/user");
const Request = require("../../models/request");
const mongoose = require("mongoose");
const HttpError = require("../../models/http-error");

const handleSendRequest = async (req, res, next) => {
  const { rideID, userID } = req.body;
  if (!rideID || !userID) {
    const error = new HttpError("rideID and userID are required.", 422);
    return next(error);
  }
  let ride;
  try {
    ride = await Ride.findById(rideID);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find ride.",
      500
    );
    return next(error);
  }
  if (!ride) {
    const error = new HttpError("Could not find ride for provided id.", 404);
    return next(error);
  }
  if (ride.type !== "pending") {
    const error = new HttpError("Ride is unavailable.", 404);
    return next(error);
  }
  let sender, recipient;
  try {
    sender = await User.findById(userID);
    recipient = await User.findById(ride.driver || ride.passenger);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find sender or recipient.",
      500
    );
    return next(error);
  }
  if (!sender || !recipient) {
    const error = new HttpError(
      "Could not find sender or recipent for provided id.",
      404
    );
    return next(error);
  }
  if (sender._id.toString() === recipient._id.toString()) {
    const error = new HttpError("You cannot send a request to yourself.", 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    const request = await Request.create({
      sender: userID,
      ride: ride._id,
      recipient: ride.driver || ride.passenger,
      time: new Date(),
      type: "pending",
    });
    sender.requests.push(request._id);
    recipient.requests.push(request._id);
    await sender.save({ session: sess });
    await recipient.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Sending request failed, please try again later.",
      500
    );
    return next(error);
  }
  res.status(201).json({ success: `Request sent!` });
};

module.exports = { handleSendRequest };
