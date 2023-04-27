const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true,},
  rating: {type: Number, required: 0},
  requests: [{ type: mongoose.Types.ObjectId, ref: 'Request' }],
  reviews: [{ type: mongoose.Types.ObjectId, ref: 'Review' }],
  ride: {type: mongoose.Types.ObjectId, ref: 'Ride'},
  model: {type: String, required: true},
  ridesTaken: {type: Number, required: true},
  ridesGiven: {type: Number, required: true},
  
  refreshToken: String
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
