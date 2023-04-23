const express = require('express');
const router = express.Router();
const cancelRideController = require('../../controllers/rideControllers/cancelRideController');

router.delete('/', cancelRideController.handleCancelRide);

module.exports = router;