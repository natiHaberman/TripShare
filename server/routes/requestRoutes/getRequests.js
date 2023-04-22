const express = require('express');
const router = express.Router();
const getRequestsController = require('../../controllers/requestControllers/getRequestsController');

router.get('/:uid', getRequestsController.handleGetRequests);

module.exports = router;