const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { isAuthenticated, isNotAuthenticated } = require("../middleware/auth");

// Landing page
router.get("/", (req, res) => {
  res.render("index");
});

// About Us page
router.get("/AboutUs", (req, res) => {
  res.render("about");
});

// Login page
router.get("/login", isNotAuthenticated, (req, res) => {
  res.render("login");
});

// Register page
router.get("/register", isNotAuthenticated, (req, res) => {
  res.render("register");
});

// Dashboard
router.get("/dashboard", isAuthenticated, (req, res) => {
  res.render("dashboard");
});

// API Routes
router.post("/api/auth/register", authController.register);
router.post("/api/auth/login", authController.login);
router.get("/api/auth/check", authController.checkAuth);
router.get("/logout", authController.logout);

module.exports = router;
