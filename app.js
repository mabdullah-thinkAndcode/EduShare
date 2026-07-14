const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");
require("dotenv").config();

const { setUserLocals } = require("./middleware/auth");
const { getConnection } = require("./config/database");

// Import routes
const authRoutes = require("./routes/auth");
const bookRoutes = require("./routes/books");
const noteRoutes = require("./routes/notes");
const reviewRoutes = require("./routes/reviews");
const trustRoutes = require("./routes/trust");
const userRoutes = require("./routes/users");

const app = express();
const PORT = process.env.PORT || 3000;

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key-change-this",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: parseInt(process.env.SESSION_MAX_AGE) || 86400000, // 24 hours
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    },
  })
);

// Flash messages
app.use(flash());

// Set user locals middleware
app.use(setUserLocals);

// Make flash messages available in all views
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

// Routes
app.use("/", authRoutes);
app.use("/", bookRoutes);
app.use("/", noteRoutes);
app.use("/", reviewRoutes);
app.use("/", trustRoutes);
app.use("/", userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : {},
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).send("Page not found");
});

// Start server and connect to database
async function startServer() {
  try {
    // Test database connection
    await getConnection();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📚 EduShare is ready!`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

startServer();

module.exports = app;
