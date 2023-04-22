const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const rideSchema = new Schema({
  type: { type: String, required: true }, 
  driver: { type: mongoose.Types.ObjectId, required: false, ref: "User" },
  passenger: { type: mongoose.Types.ObjectId, required: false, ref: "User" },
  origin: {type: String, required: true},
  destination: {type: String, required: true},
  duration: {type: String, required: true},
  distance: {type: String, required: true},
  departureTime: {type: String, required: true},
});

module.exports = mongoose.model("Ride", rideSchema);
