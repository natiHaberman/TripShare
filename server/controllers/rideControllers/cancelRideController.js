const Ride = require("../../models/ride");
const User = require("../../models/user");
const Request = require("../../models/request");
const HttpError = require("../../models/http-error");

const handleCancelRide = async (req, res, next) => {
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
      "Fetching ride failed, please try again later.",
      500
    );
    return next(error);
  }
  if (!ride) {
    const error = new HttpError("Could not find ride for provided id.", 404);
    return next(error);
  }
  if (ride.type === "completed") {
    const error = new HttpError("Ride is already completed.", 404);
    return next(error);
  }
  if (ride.type === "canceled") {
    const error = new HttpError("Ride is already canceled.", 404);
    return next(error);
  }
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
  if (!user) {
    const error = new HttpError("Could not find user for provided id.", 404);
    return next(error);
  }
  let otherUser;
  if (ride.driver?.toString() === userID)
    otherUser = await User.findById(ride.passenger);
  else if (ride.passenger?.toString() === userID)
    otherUser = await User.findById(ride.driver);
  else {
    const error = new HttpError("User is not authorized to cancel ride.", 401);
    return next(error);
  }
  try {
    user.ride = null;
    await user.save();
    if (otherUser) {
      otherUser.ride = null;
      otherUser.save();
    }
    ride.type = "canceled";
    await ride.save();
  } catch {
    const error = new HttpError(
      "Canceling ride failed, please try again later.",
      500
    );
    return next(error);
  }
  //cancel reuests for other users to ride
  try {
    await Request.updateMany(
      { ride: rideID, type: "pending" },
      { $set: { type: "canceled" } }
    );
  } catch {}
  res.status(200).json({ message: "Canceled ride." });
};

module.exports = { handleCancelRide };
