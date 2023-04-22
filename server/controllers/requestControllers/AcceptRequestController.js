const Request = require("../../models/request");
const HttpError = require("../../models/http-error");

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
    if (request.recipient?.toString() === userID || request.sender?.toString() === userID) {
        const error = new HttpError("You cannot accept your own request.", 401);
        return next(error);
    }
    try{
    request.recipient = userID;
    await request.save();
    } catch {
        const error = new HttpError("Accepting request failed, please try again.", 500);
        return next(error);
    }
    res.status(201).json({ success: `Request accepted!` });
};

module.exports = { handleAcceptRequest };