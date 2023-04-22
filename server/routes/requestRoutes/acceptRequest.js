const express = require('express');
const router = express.Router();
const acceptRequestController = require('../../controllers/requestControllers/acceptRequestController');

router.post('/', acceptRequestController.handleAcceptRequest);

module.exports = router;