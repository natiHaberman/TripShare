const Ride = require("../../models/ride");
const HttpError = require("../../models/http-error");

const handleDeleteRide = async (req, res, next) => {
  const { rideID } = req.body;
  if (!rideID) {
    const error = new HttpError("rideID is required.", 422);
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
  try {
    await Ride.deleteOne({ _id: rideID });
} catch (err) {
    const error = new HttpError(
      "Deleting ride failed, please try again later.",
      500
    );
    return next(error);
  }
  res.status(200).json({ message: "Deleted ride." });
};

module.exports = { handleDeleteRide };
