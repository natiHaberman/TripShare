const express = require('express');
const router = express.Router();
const updateController = require('../../controllers/userControllers/updateController');

router.patch('/', updateController.handleUpdateUser);

module.exports = router;