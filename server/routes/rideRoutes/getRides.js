const express = require('express');
const router = express.Router();
const getRidesController = require('../../controllers/rideControllers/getRidesController');

router.get('/:type', getRidesController.handleGetRides);

module.exports = router;