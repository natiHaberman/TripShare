const express = require('express');
const router = express.Router();
const findUserController = require('../../controllers/userControllers/findUserController');

router.get('/:uid', findUserController.handleFindUser);

module.exports = router;