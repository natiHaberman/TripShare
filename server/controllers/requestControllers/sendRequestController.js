const Ride = require("../../models/ride");
const User = require("../../models/user");
const Request = require("../../models/request");
const mongoose = require("mongoose");
const HttpError = require("../../models/http-error");

const handleSendRequest = async (req, res, next) => {

  // Returns error if body does not include required fields
  const { rideID, userID } = req.body;
  if (!rideID || !userID) {
    const error = new HttpError("rideID and userID are required.", 422);
    return next(error);
  }

  // Searches for ride in database and returns error if fails
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

  // Returns error if ride is not found
  if (!ride) {
    const error = new HttpError("Could not find ride for provided id.", 404);
    return next(error);
  }

  // Returns error if ride is not available
  if (ride.type !== "pending") {
    const error = new HttpError("Ride is unavailable.", 404);
    return next(error);
  }

  // Returns error if fails to fetch users
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

  // Returns error if sender or recipient are not found
  if (!sender || !recipient) {
    const error = new HttpError(
      "Could not find sender or recipient for provided id.",
      404
    );
    return next(error);
  }

  // Returns error if sender and recipient are the same
  if (sender._id.toString() === recipient._id.toString()) {
    const error = new HttpError("You cannot send a request to yourself.", 404);
    return next(error);
  }

  // Returns error if user has already requested to join this ride
  let otherRequest;
  try {
    otherRequest = await Request.findOne({
      sender: sender._id,
      ride: ride._id,
      type: "pending",
    });
  } catch (err) {}
  if (otherRequest) {
    const error = new HttpError(
      "You have already sent a request for this ride.",
      404
    );
    return next(error);
  }

  // Sends request and returns error if fails
  try {

    // Starts transaction to ensure all changes are made or none are made
    const session = await mongoose.startSession();
    session.startTransaction();
    const request = new Request({
      sender: userID,
      ride: ride._id,
      recipient: ride.driver || ride.passenger,
      time: new Date(),
      type: "pending",
    });
    sender.requests.push(request._id);
    recipient.requests.push(request._id);
    await request.save({ session: session });
    await sender.save({ session: session });
    await recipient.save({ session: session });
    await session.commitTransaction();
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
