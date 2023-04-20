const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const requestSchema = new Schema({
  sender: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  recipient: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  time: { type: Date, required: true },
  ride: { type: mongoose.Types.ObjectId, required: true, ref: "Ride" },
});

module.exports = mongoose.model("Request", requestSchema);
