const Ride = require("../../models/ride");
const User = require("../../models/user");
const Request = require("../../models/request");
const HttpError = require("../../models/http-error");

const handleSendRequest = async (req, res, next) => {
    const { rideID, email } = req.body;
    if (!rideID || !email) {
        const error = new HttpError("rideID and email are required.", 422);
        return next(error);
    }
    let ride;
    try {
        ride = await Ride.findById(rideID);
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
    if (ride.type === "confirmed") {
        const error = new HttpError("Ride is full.", 404);
        return next(error);
    }
    let user;
    try {
        user = await User.findOne({ email: email });
    }
    catch (err) {
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
        await Request.create({
            sender: user._id,
            ride: ride._id,
            recipient: ride.driver || ride.passenger,
            time: new Date(),
          });
        }
        catch (err) {
            const error = new HttpError(
                "Sending request failed, please try again later.",
                500
            );
            return next(error);
        }
        res.status(201).json({ success: `Request sent!` });
  };

module.exports = { handleSendRequest };
