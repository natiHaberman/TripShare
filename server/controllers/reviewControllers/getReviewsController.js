const Review = require("../../models/review");
const HttpError = require("../../models/http-error");

const handleGetReviews = async (req, res, next) => {
  // Returns error if params does not include uid
  const uid = req.params.uid;
  const type = req.params.type;
  if (!uid || !type) {
    const error = new HttpError("User ID and type are required.", 422);
    return next(error);
  }

  // Searches for reviews in database and returns error if fails
  let reviews;  
  try {
    reviews = await Review.find({ [type]: uid });
  } catch (err) {
    const error = new HttpError(
      "Fetching reviews failed, please try again later.",
      500
    );
    return next(error);
  }
  res.json({
    reviews: reviews.map((reviews) => reviews.toObject({ getters: true })),
  });
};

module.exports = { handleGetReviews };
