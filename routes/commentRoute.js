const express = require("express");
const authenticate = require("../middlewares/authenticate");
const {
  createComment,
  updateComment,
  deleteComment,
} = require("../controllers/commentController");

const router = express.Router();

// TODO: Create Comment
router.post("/", authenticate, createComment);

// TODO: Update Comment
router.patch("/:id", authenticate, updateComment);

// TODO: Delete Comment
router.delete("/:id", authenticate, deleteComment);

module.exports = router;
