const express = require('express');
const router = express.Router();
const deleteRequestController = require('../../controllers/requestControllers/deleteRequestController');

router.delete('/', deleteRequestController.handleDeleteRequest);

module.exports = router;