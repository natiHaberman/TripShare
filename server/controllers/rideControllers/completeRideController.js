const Ride = require("../../models/ride");
const User = require("../../models/user");
const HttpError = require("../../models/http-error");

const handleCompleteRide = async (req, res, next) => {
  // Returns error if body does not include required fields
  const { rideID, userID } = req.body;
  if (!rideID || !userID) {
    const error = new HttpError("rideID and userId are required.", 422);
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

  let driver, passenger;
  try {
    driver = await User.findById(ride.driver);
    passenger = await User.findById(ride.passenger);
  } catch (err) {
    const error = new HttpError(
      "Fetching users to complete ride failed, please try again later",
      500
    );
    return next(error);
  }

  // Returns error if ride is not ongoing or missing driver or passenger
  if (ride.type !== "ongoing" || !ride.driver || !ride.passenger) {
    const error = new HttpError(
      "Ride is not valid and therefore cannot be completed.",
      404
    );
    return next(error);
  }

  // Returns error if user is not part of ride
  if (
    ride.driver?.toString() !== userID &&
    ride.passenger?.toString() !== userID
  ) {
    const error = new HttpError("User is not part of this ride.", 404);
    return next(error);
  }

  // Completes ride and returns error if it fails
  try {
    // Starts session to ensure that the ride is completed at the same time for both users and the ride
    const session = await Ride.startSession();
    session.startTransaction();
    driver.ride = null;
    driver.ridesGiven++;
    await driver.save({ session: session });
    passenger.ride = null;
    passenger.ridesTaken++;
    await passenger.save({ session: session });
    ride.type = "completed";
    await ride.save({ session: session });
    await session.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Completing ride failed, please try again later.",
      500
    );
    return next(error);
  }
  res.status(200).json({ message: "Completed ride." });
};

module.exports = { handleCompleteRide };
