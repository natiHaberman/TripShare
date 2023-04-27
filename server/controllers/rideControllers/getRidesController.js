const Ride = require("../../models/ride");
const HttpError = require("../../models/http-error");

const handleGetRides = async (req, res, next) => {

  // Returns error if params does not include type
  const type = req.params.type;
  if (!type) {
    const error = new HttpError("Type is required.", 422);
    return next(error);
  }

  // Searches for rides in database and returns error if fails
  let rides;
  try {
    rides = await Ride.find({ type: type });
  } catch (err) {
    const error = new HttpError(
      "Fetching rides failed, please try again later.",
      500
    );
    return next(error);
  }
  res.json({ rides: rides.map((rides) => rides.toObject({ getters: true })) });
};

module.exports = { handleGetRides };
