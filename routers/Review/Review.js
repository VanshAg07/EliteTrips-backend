const express = require("express");

const reviewRoute = require("../../controllers/Reviews/ReviewController");

const router = express.Router();

router.post("/review", reviewRoute.addReview);

router.get("/reviews", reviewRoute.getReviews);

router.patch("/reviews", reviewRoute.updateReview);

router.delete("/reviews/:id", reviewRoute.deleteReview);

module.exports = router;