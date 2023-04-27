const Ride = require("../../models/ride");
const User = require("../../models/user");
const HttpError = require("../../models/http-error");
const getDistanceMatrix = require("../../util/distance");

const handleNewRide = async (req, res, next) => {
  // Returns error if body does not include required fields
  const { role, userID, origin, destination, departureTime } = req.body;
  if (!role || !userID || !origin || !destination || !departureTime) {
    const error = new HttpError(
      "role, userID, origin, destination and departure time are required.",
      422
    );
    return next(error);
  }

  // Searches for user in database and returns error if fails
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

  // Returns error if user is not found
  if (!user) {
    const error = new HttpError("Could not find user for provided id.", 404);
    return next(error);
  }

  // Returns error if user already has a ride
  if (user.ride) {
    const error = new HttpError(
      "You already have a ride. Cancel it first if you wish to create a new one",
      422
    );
    return next(error);
  }

  // Creates the new ride and returns error if it fails
  try {
    const { distance, duration } = await getDistanceMatrix(origin, destination);
    
    // Starts session to ensure that the ride and user are created at the same time
    const session = await Ride.startSession();
    session.startTransaction();
    const ride = new Ride({
      type: "pending",
      [role]: userID,
      origin: origin,
      destination: destination,
      distance: distance.text,
      duration: duration.text,
      departureTime: departureTime,
    });
    user.ride = ride._id;
    await user.save({ session: session });
    await ride.save({ session: session });
    await session.commitTransaction();
  } catch {
    const error = new HttpError("creating ride failed, please try again.", 500);
    return next(error);
  }
  res.status(201).json({ success: `New ride created!` });
};

module.exports = { handleNewRide };
