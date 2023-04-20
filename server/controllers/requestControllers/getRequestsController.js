const Request = require('../../models/request');
const User = require('../../models/user');
const HttpError = require('../../models/http-error');

const handleGetRequests = async (req, res, next) => {
    const { email, role } = req.body;
    if (!email || !role) {
        const error = new HttpError('email and role are required.', 422);
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
    let requests;
    try {
        if (role === "sender") {
            requests = await Request.find({ sender: user._id })
        }
        else if (role === "recipient") {
            requests = await Request.find({ recipient: user._id })
        }
        else{
            const error = new HttpError("role must be sender or recipient.", 422);
            return next(error);
        }
    }
    catch (err) {
        const error = new HttpError(
            "Getting requests failed, please try again later.",
            500
        );
        return next(error);
    }
    res.status(200).json({ requests: requests.map(request => request.toObject({ getters: true })) });
};

module.exports = { handleGetRequests };