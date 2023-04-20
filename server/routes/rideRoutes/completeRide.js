const express = require('express');
const router = express.Router();
const completeRideController = require('../../controllers/rideControllers/completeRideController');

router.patch('/', completeRideController.handleCompleteRide);

module.exports = router;