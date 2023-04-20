const express = require('express');
const router = express.Router();
const authController = require('../../controllers/userControllers/authController');

router.post('/', authController.handleLogin);

module.exports = router;