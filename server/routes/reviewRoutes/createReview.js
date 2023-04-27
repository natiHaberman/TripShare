const express = require('express');
const router = express.Router();
const  createReviewController= require('../../controllers/reviewControllers/createReviewController');
router.post('/', createReviewController.handleCreateReview);

module.exports = router;