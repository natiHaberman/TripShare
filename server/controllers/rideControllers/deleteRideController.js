const Ride = require("../../models/ride");
const HttpError = require("../../models/http-error");

const handleDeleteRide = async (req, res, next) => {
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
  if (ride.driver?.toString() !== userID && ride.passenger?.toString() !== userID) {
    const error = new HttpError("User is unauthorized to delete ride.", 401);
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
