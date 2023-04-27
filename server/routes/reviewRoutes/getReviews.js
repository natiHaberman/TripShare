const express = require('express');
const router = express.Router();
const  getReviewsController= require('../../controllers/reviewControllers/getReviewsController');
router.get('/:uid/:type', getReviewsController.handleGetReviews);

module.exports = router;