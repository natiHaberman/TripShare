const Ride = require("../../models/ride");
const User = require("../../models/user");
const Request = require("../../models/request");
const mongoose = require("mongoose");

const HttpError = require("../../models/http-error");

const handleCancelRide = async (req, res, next) => {
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
      "Fetching ride failed, please try again later.",
      500
    );
    return next(error);
  }

  // Returns error if ride is not found
  if (!ride) {
    const error = new HttpError("Could not find ride for provided id.", 404);
    return next(error);
  }

  // Fetches driver and passenger
  let driver, passenger;
  try {
    driver = await User.findById(ride.driver);
  } catch (err) {}
  try {
    passenger = await User.findById(ride.passenger);
  } catch (err) {}

  // Returns error if ride is not pending or ongoing or empty
  if (
    (ride.type !== "pending" && ride.type !== "ongoing") ||
    (!driver && !passenger)
  ) {
    const error = new HttpError(
      "Ride is not valid and therefore cannot be canceled.",
      404
    );
    return next(error);
  }

  // Returns error if fails to fetch user
  let user;
  try {
    user = await User.findById(userID);
  } catch (err) {
    const error = new HttpError(
      "Fetching user failed, please try again later.",
      500
    );
    return next(error);
  }

  // Returns error if user is not found
  if (!user) {
    const error = new HttpError("Could not find user for provided id.", 404);
    return next(error);
  }

  // Returns error if user is not part of ride
  if (
    driver?._id.toString() !== userID &&
    passenger?._id.toString() !== userID
  ) {
    const error = new HttpError("User is not authorized to cancel ride.", 401);
    return next(error);
  }

  // Cancels ride and returns error if it fails
  try {
    // Starts transaction to ensure all changes are made or none are made
    const session = await mongoose.startSession();
    session.startTransaction();
    if (driver) {
      driver.ride = null;
      await driver.save({ session: session });
    }

    if (passenger) {
      passenger.ride = null;
      await passenger.save({ session: session });
    }
    ride.type = "canceled";
    await Request.updateMany(
      { ride: rideID, type: "pending" },
      { $set: { type: "canceled" } },
      { session: session }
    );
    await ride.save({ session: session });
    await session.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Canceling ride failed, please try again later.",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "Ride canceled." });
};

module.exports = { handleCancelRide };
