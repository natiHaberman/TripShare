const Request = require("../../models/request");
const User = require("../../models/user");
const HttpError = require("../../models/http-error");

const handleGetRequests = async (req, res, next) => {
  const userID = req.params.uid;
  if (!userID) {
    const error = new HttpError("userID is required.", 422);
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
  let requests;
  try {
    recievedRequests = await Request.find({ recipient: userID });
    sentRequests = await Request.find({ sender: userID });
    requests = [...recievedRequests, ...sentRequests];
  } catch (err) {
    const error = new HttpError(
      "Getting requests failed, please try again later.",
      500
    );
    return next(error);
  }
  res
    .status(200)
    .json({
      requests: requests.map((request) => request.toObject({ getters: true })),
    });
};

module.exports = { handleGetRequests };
