const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const { isAuthenticated } = require("../middleware/auth");

// Page routes
router.get("/reviews", isAuthenticated, (req, res) => {
  res.render("reviews");
});

router.get("/add-review", isAuthenticated, (req, res) => {
  res.render("add-review");
});

// API routes
router.get("/api/reviews", isAuthenticated, reviewController.getAllReviews);
router.get(
  "/api/reviews/book/:bookId",
  isAuthenticated,
  reviewController.getBookReviews
);
router.get(
  "/api/reviews/user/my",
  isAuthenticated,
  reviewController.getUserReviews
);
router.post("/api/reviews", isAuthenticated, reviewController.addReview);
router.put(
  "/api/reviews/:reviewId",
  isAuthenticated,
  reviewController.updateReview
);
router.delete(
  "/api/reviews/:reviewId",
  isAuthenticated,
  reviewController.deleteReview
);
router.get(
  "/api/reviews/books/available",
  isAuthenticated,
  reviewController.getBooksForReview
);
router.get(
  "/api/reviews/book/:bookId/average",
  isAuthenticated,
  reviewController.getBookAverageRating
);

module.exports = router;
