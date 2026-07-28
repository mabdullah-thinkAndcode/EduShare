const express = require("express");
const router = express.Router();
const trustController = require("../controllers/trustController");
const { isAuthenticated } = require("../middleware/auth");

// Page routes
router.get("/trust", isAuthenticated, (req, res) => {
  res.render("trust-ratings");
});

router.get("/rate-user", isAuthenticated, (req, res) => {
  res.render("rate-user");
});

// API routes
router.get(
  "/api/trust/users",
  isAuthenticated,
  trustController.getAllUsersTrust
);
router.get(
  "/api/trust/user/:userId",
  isAuthenticated,
  trustController.getUserTrust
);
router.post("/api/trust/rate", isAuthenticated, trustController.rateUser);
router.get(
  "/api/trust/rateable-users",
  isAuthenticated,
  trustController.getUsersToRate
);
router.get(
  "/api/trust/my-ratings",
  isAuthenticated,
  trustController.getMyRatings
);
router.get(
  "/api/trust/received-ratings",
  isAuthenticated,
  trustController.getReceivedRatings
);

module.exports = router;
