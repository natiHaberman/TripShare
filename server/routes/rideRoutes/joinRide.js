const express = require('express');
const router = express.Router();
const joinRideController = require('../../controllers/rideControllers/joinRideController');

router.patch('/', joinRideController.handleJoinRide);

module.exports = router;