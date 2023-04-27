const User = require("../../models/user");
const Review = require("../../models/review");
const mongoose = require("mongoose");
const HttpError = require("../../models/http-error");

const handleCreateReview = async (req, res, next) => {
  // Returns error if body does not include required fields
  const { authorID, subjectID, rating, text } = req.body;
  if (!authorID || !subjectID) {
    const error = new HttpError(
      "authorID, subjectID, rating, and text are required.",
      422
    );
    return next(error);
  }

  // Searches for users in database and returns error if fails
  let author, subject;
  try {
    author = await User.findById(authorID);
    subject = await User.findById(subjectID);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find author or subject.",
      500
    );
    return next(error);
  }

  // Returns error if author or subject are not found
  if (!author || !subject) {
    const error = new HttpError(
      "Could not find author or subject for provided id.",
      404
    );
    return next(error);
  }

  // Returns error if author and subject are the same
  if (authorID === subjectID) {
    const error = new HttpError("You cannot review yourself.", 404);
    return next(error);
  }

  // Creates new review and saves it to database and returns error if fails
  try {
    // Start session to ensure that all operations are atomic
    const session = await mongoose.startSession();
    session.startTransaction();

    // Calculate new rating for subject
    let totalRating = rating;
    for (reviewID of subject.reviews) {
      let reviewData;
      try {
        reviewData = await Review.findById(review.toString());
      } catch (err) {
        continue;
      }
      totalRating += reviewData.rating;
    }
    subject.rating = totalRating / (subject.reviews.length + 1);

    // Create new review and add it to author and subject
    const review = new Review({
      author: authorID,
      subject: subjectID,
      rating: rating || 0,
      text: text || "",
    });
    author.reviews.push(review._id);
    subject.reviews.push(review._id);
    await review.save({ session: session });
    await author.save({ session: session });
    await subject.save({ session: session });
    await session.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not create review.",
      500
    );
    return next(error);
  }

  res.status(201).json({ success: `New Review created!` });
};

module.exports = { handleCreateReview };
