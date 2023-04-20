const express = require('express');
const router = express.Router();
const deleteRideController = require('../../controllers/rideControllers/deleteRideController');

router.delete('/', deleteRideController.handleDeleteRide);

module.exports = router;