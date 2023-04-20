const Ride = require("../../models/ride");
const User = require("../../models/user");
const Request = require("../../models/request");
const HttpError = require("../../models/http-error");

const handleDeleteRequest = async (req, res, next) => {
    const { rideID, email, role } = req.body;
    if (!rideID || !email || !role) {
        const error = new HttpError("rideID, role and email are required.", 422);
        return next(error);
     };
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
        if (role === "sender") {
            await Request.deleteOne({ sender: user._id, ride: ride._id });
        }
        else if (role === "recipient") {
            await Request.deleteOne({ recipient: user._id, ride: ride._id });
        }
        else {
            const error = new HttpError("Request Doesn't exist", 404);
            return next(error);
        }
    }
    catch (err) {
        const error = new HttpError(
            "Deleting request failed, please try again later.",
            500
        );
        return next(error);
    }
    res.status(200).json({ message: "Deleted request." });
};
module.exports = { handleDeleteRequest };
