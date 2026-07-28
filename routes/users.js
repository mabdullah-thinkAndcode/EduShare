const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { isAuthenticated } = require("../middleware/auth");

// Page routes
router.get("/user-profile", isAuthenticated, (req, res) => {
  res.render("user-profile");
});

router.get("/user/:userId", isAuthenticated, (req, res) => {
  res.render("other-user-profile");
});

// API routes
router.get("/api/users", isAuthenticated, userController.getAllUsers);
router.get(
  "/api/users/profile",
  isAuthenticated,
  userController.getCurrentUserProfile
);
router.get(
  "/api/users/:userId",
  isAuthenticated,
  userController.getUserProfile
);
router.put("/api/users/profile", isAuthenticated, userController.updateProfile);

module.exports = router;
