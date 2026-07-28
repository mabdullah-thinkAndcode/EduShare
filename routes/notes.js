const express = require("express");
const router = express.Router();
const noteController = require("../controllers/noteController");
const { isAuthenticated } = require("../middleware/auth");

// Page routes
router.get("/notes", isAuthenticated, (req, res) => {
  res.render("notes");
});

// API routes
router.get("/api/notes", isAuthenticated, noteController.getAllNotes);
router.get(
  "/api/notes/book/:bookId",
  isAuthenticated,
  noteController.getBookNotes
);
router.get("/api/notes/user/my", isAuthenticated, noteController.getUserNotes);
router.post("/api/notes", isAuthenticated, noteController.addNote);
router.delete("/api/notes/:noteId", isAuthenticated, noteController.deleteNote);
router.get(
  "/api/notes/books/available",
  isAuthenticated,
  noteController.getBooksForNotes
);

module.exports = router;
