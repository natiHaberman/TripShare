const Ride = require('../../models/ride');
const HttpError = require('../../models/http-error');

const handleGetRides = async (req, res, next) => {
    let rides;
    const {type} = req.body;
    try {
      rides = await Ride.find({type : type});
    } catch (err) {
      const error = new HttpError(
        'Fetching rides failed, please try again later.',
        500
      );
      return next(error);
    }
    res.json({ rides: rides.map(rides => rides.toObject({ getters: true })) });
}

module.exports = { handleGetRides };