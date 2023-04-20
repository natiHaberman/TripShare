const Ride = require("../../models/ride");
const User = require("../../models/user");
const HttpError = require("../../models/http-error");

const handleJoinRide = async (req, res, next) => {
  const { rideID, email} = req.body;
  if (!rideID || !email) {
    const error = new HttpError("rideID and email are required.", 422);
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
    user = await User.findOne({ email: email });
    console.log(user);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find user.",
      500
    );
    return next(error);
  }
  if (!user) {
    const error = new HttpError("Could not find user for provided email.", 404);
    return next(error);
  }

  try {
    if (!ride.driver) {
        ride.driver = user._id;
    }
    else if (!ride.passenger) {
        ride.passenger = user._id;
    }
    else {
        const error = new HttpError("Ride is full.", 404);
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
