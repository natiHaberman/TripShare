const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const reviewSchema = new Schema({

  author: { type: mongoose.Types.ObjectId, required: false, ref: "User" },
  subject: { type: mongoose.Types.ObjectId, required: false, ref: "User" },
  rating: {type: Number, required: true},
  text: {type: String, required: true},
});

module.exports = mongoose.model("Review", reviewSchema);
