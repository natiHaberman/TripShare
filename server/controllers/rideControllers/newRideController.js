const Ride = require("../../models/ride");
const User = require("../../models/user");
const HttpError = require("../../models/http-error");
const getDistanceMatrix = require("../../util/distance");

const handleNewRide = async (req, res, next) => {
  const { role, userID, origin, destination, departureTime } = req.body;
  if (!role || !userID || !origin || !destination || !departureTime) {
    const error = new HttpError("role, userID, origin, destination and departure time are required.", 422);
    return next(error);
  }
  let user;
  try {
    user = await User.findById(userID);
    console.log(user);
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
  if (user.ride){
    const error = new HttpError("You already have a ride. Cancel it first if you wish to create a new one", 422);
    return next(error);
  }
  try {
    const { distance, duration } = await getDistanceMatrix(origin, destination);
    console.log(distance.text, duration.text);
    if (role === "driver") {
      await Ride.create({
        type: "pending",
        driver: userID,
        origin: origin,
        destination: destination,
        distance: distance.text,
        duration: duration.text,
        departureTime: departureTime,
        
      });
    } else {
      await Ride.create({
        type: "pending",
        passenger: userID,
        origin: origin,
        destination: destination,
        distance: distance.text,
        duration: duration.text,
        departureTime: departureTime,
      });
    }
  } catch {
    const error = new HttpError("creating ride failed, please try again.", 500);
    return next(error);
  }
  res.status(201).json({ success: `New ride created!` });
};

module.exports = { handleNewRide };
