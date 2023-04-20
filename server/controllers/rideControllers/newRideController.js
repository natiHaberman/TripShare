const Ride = require("../../models/ride");
const User = require("../../models/user");
const HttpError = require("../../models/http-error");

const handleNewRide = async (req, res, next) => {
  const { role, email, origin, destination } = req.body;
  if (!role || !email || !origin || !destination) {
    const error = new HttpError("role, email, origin and destination are required.", 422);
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
    if (role === "driver") {
      await Ride.create({
        type: "pending",
        driver: user._id,
        origin: origin,
        destination: destination,
      });
    } else {
      await Ride.create({
        type: "pending",
        passenger: user._id,
        origin: origin,
        destination: destination,
      });
    }
  } catch {
    const error = new HttpError("creating ride failed, please try again.", 500);
    return next(error);
  }
  res.status(201).json({ success: `New ride created!` });
};

module.exports = { handleNewRide };
