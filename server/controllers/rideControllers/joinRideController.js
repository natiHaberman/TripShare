const Ride = require("../../models/ride");
const User = require("../../models/user");
const HttpError = require("../../models/http-error");

const handleJoinRide = async (req, res, next) => {
  const { rideID, userID} = req.body;
  if (!rideID || !userID) {
    const error = new HttpError("rideID and userID are required.", 422);
    return next(error);
  }
  let ride;
  try {
    ride = await Ride.findById(rideID);
    console.log(ride);
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
  try {
    if (!ride.driver && ride.passenger.toString() !== userID) {
        ride.driver = userID;
    }
    else if (!ride.passenger && ride.driver.toString() !== userID) {
        ride.passenger = userID;
    }
    else {
        const error = new HttpError("Cannot join ride.", 404);
        return next(error);
    }
    ride.type = "confirmed";
    await ride.save();
  } catch {
    const error = new HttpError("Joining ride failed, please try again.", 500);
    return next(error);
  }
  res.status(201).json({ success: `User joined ride!` });
};

module.exports = { handleJoinRide };
