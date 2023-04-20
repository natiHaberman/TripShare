const express = require('express');
const router = express.Router();
const newRideController = require('../../controllers/rideControllers/newRideController');

router.post('/', newRideController.handleNewRide);

module.exports = router;