const express = require('express');
const router = express.Router();
const sendRequestController = require('../../controllers/requestControllers/sendRequestController');

router.post('/', sendRequestController.handleSendRequest);

module.exports = router;