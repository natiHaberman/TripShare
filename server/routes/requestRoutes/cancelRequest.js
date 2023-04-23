const express = require('express');
const router = express.Router();
const cancelRequestController = require('../../controllers/requestControllers/cancelRequestController');

router.delete('/', cancelRequestController.handleCancelRequest);

module.exports = router;