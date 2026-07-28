const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");
const { isAuthenticated } = require("../middleware/auth");

// Page routes
router.get("/borrow-books", isAuthenticated, (req, res) => {
  res.render("borrow-books");
});

router.get("/my-books", isAuthenticated, (req, res) => {
  res.render("my-books");
});

// API routes
router.get("/api/books", isAuthenticated, bookController.getAllBooks);
router.get("/api/books/:id", isAuthenticated, bookController.getBookById);
router.post("/api/books", isAuthenticated, bookController.addBook);
router.get(
  "/api/books/user/owned",
  isAuthenticated,
  bookController.getUserBooks
);
router.get(
  "/api/books/user/borrowed",
  isAuthenticated,
  bookController.getBorrowedBooks
);
router.get(
  "/api/books/my-requests",
  isAuthenticated,
  bookController.getMyRequests
);
router.get(
  "/api/books/transaction-history",
  isAuthenticated,
  bookController.getTransactionHistory
);

// Borrow request routes
router.post(
  "/api/books/borrow/request",
  isAuthenticated,
  bookController.requestBorrow
);
router.get(
  "/api/books/borrow/requests",
  isAuthenticated,
  bookController.getBorrowRequests
);
router.post(
  "/api/books/borrow/approve",
  isAuthenticated,
  bookController.approveBorrowRequest
);
router.post(
  "/api/books/borrow/deny",
  isAuthenticated,
  bookController.denyBorrowRequest
);

// Return request routes
router.post(
  "/api/books/return/request",
  isAuthenticated,
  bookController.requestReturn
);
router.get(
  "/api/books/return/requests",
  isAuthenticated,
  bookController.getReturnRequests
);
router.post(
  "/api/books/return/approve",
  isAuthenticated,
  bookController.approveReturn
);

module.exports = router;
