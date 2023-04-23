const Request = require("../../models/request");
const Ride = require("../../models/ride");
const HttpError = require("../../models/http-error");
const User = require("../../models/user");

const handleAcceptRequest = async (req, res, next) => {
  const { requestID, userID } = req.body;
  if (!requestID || !userID) {
    const error = new HttpError("userID and requestID are required.", 422);
    return next(error);
  }
  let request;
  try {
    request = await Request.findById(requestID);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find request.",
      500
    );
    return next(error);
  }
  if (!request) {
    const error = new HttpError("Could not find request for provided id.", 404);
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

  if (request.recipient?.toString() !== userID) {
    const error = new HttpError(
      "You are not authorized to accept this request.",
      401
    );
    return next(error);
  }

  try {
    const session = await Request.startSession();
    session.startTransaction();
    const ride = await Ride.findById(request.ride);
    if (ride.type==="pending" && !ride.passenger) {
      ride.passenger = userID;
    } else if (ride.type==="pending" && !ride.driver) {
      ride.driver = userID;
    } else {
      request.type = "canceled";
      await request.save({ session: session });
      await sess.commitTransaction();
      const error = new HttpError("Ride is unavailable.", 404);
      return next(error);
    }
    ride.type = "ongoing";
    request.type = "accepted";
    user.ride = ride._id;
    await user.save({ session: session });
    await ride.save({ session: session });
    await request.save({ session: session });
    await session.commitTransaction();
  } catch {
    const error = new HttpError(
      "Something went wrong, could not accept request.",
      500
    );
    return next(error);
  }
  try {
    await Request.updateMany(
      { ride: request.ride, type: "pending" },
      { $set: { type: "canceled" } }
    );
  }
  catch{}
  res.status(201).json({ success: `Request accepted!` });
};

module.exports = { handleAcceptRequest };
