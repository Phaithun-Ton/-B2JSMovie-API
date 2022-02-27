const express = require("express");
const authenticate = require("../middlewares/authenticate");
const {
  getAllPostTagName,
  addPostTagName,
  deletePostTagName,
} = require("../controllers/postTagNameController");

const router = express.Router();

// TODO: Get all post tag name
router.get("/:postId", authenticate, getAllPostTagName);

// TODO: Add post tag name
router.post("/:postId/:tagNameId", authenticate, addPostTagName);

// TODO: Delete post tag name
router.delete("/:postId/:tagNameId", authenticate, deletePostTagName);

module.exports = router;
