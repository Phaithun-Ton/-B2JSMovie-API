const express = require("express");
const authenticate = require("../middlewares/authenticate");
const {
  createLike,
  unLike,
  findLikeByUser,
} = require("../controllers/likeController");

const router = express.Router();

// TODO: Find like by user
router.get("/:postId", authenticate, findLikeByUser);

// TODO: Like post
router.post("/:postId", authenticate, createLike);

// TODO: Unlike post
router.delete("/:postId", authenticate, unLike);

module.exports = router;
