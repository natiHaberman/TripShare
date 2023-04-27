const Ride = require("../../models/ride");
const Request = require("../../models/request");
const User = require("../../models/user");
const mongoose = require("mongoose");
const HttpError = require("../../models/http-error");

const handleAcceptRequest = async (req, res, next) => {

  // Returns error if body does not include required fields
  const { requestID, userID } = req.body;
  if (!requestID || !userID) {
    const error = new HttpError("userID and requestID are required.", 422);
    return next(error);
  }

  // Returns error if fails to fetch request
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
      "Something went wrong while fetching users.",
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

  // Returns error if user is not authorized to accept request
  if (recipient._id.toString() !== userID) {
    const error = new HttpError(
      "You are not authorized to accept this request.",
      401
    );
    return next(error);
  }

  // Returns error if recipient is already in a ride
  if (sender.ride){
    const error = new HttpError(
      "You are already in a ride.",
      401
    );
    return next(error);
  }

  // Returns error if fails to fetch ride
  let ride;
  try {
    ride = await Ride.findById(request.ride);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not fetch ride.",
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
    const error = new HttpError(
      "Ride is unavailable.",
      404
    );
    return next(error);
  }

  // Returns error if user is not authorized to accept request
  try {

    // Starts transaction and updates request, ride, and user and cancel other requests for the ride
    const session = await mongoose.startSession();
    session.startTransaction();
    if (!ride.passenger) {
      ride.passenger = sender._id;
    } else if (!ride.driver) {
      ride.driver = sender._id;
    } else {
      request.type = "canceled";
      await request.save({ session: session });
      await sess.commitTransaction();
      const error = new HttpError("Ride is unavailable.", 404);
      return next(error);
    }
    sender.ride = ride._id;
    ride.type = "ongoing";
    request.type = "accepted";
    recipient.ride = ride._id;
    await recipient.save({ session: session });
    await sender.save({ session: session });
    await ride.save({ session: session });
    await request.save({ session: session });
    await Request.updateMany(
      { ride: request.ride, type: "pending" },
      { $set: { type: "canceled" } },
      { session: session },
      );
    await session.commitTransaction();
  } catch {
    const error = new HttpError(
      "Something went wrong, could not accept request.",
      500
    );
    return next(error);
  }
  
  res.status(201).json({ success: `Request accepted!` });
};

module.exports = { handleAcceptRequest };
