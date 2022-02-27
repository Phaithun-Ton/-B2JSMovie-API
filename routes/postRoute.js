const express = require("express");
const authenticate = require("../middlewares/authenticate");
const {
  getAllPosts,
  getPostByUser,
  getPost,
  createPost,
  updatePost,
  deletePost,
  deleteImage,
} = require("../controllers/postController");
const upload = require("../middlewares/upload");

const router = express.Router();

// TODO: Get all post
router.get("/", authenticate, getAllPosts);

// TODO: Get post by user
router.get("/postByUser", authenticate, getPostByUser);

// TODO: Get post
router.get("/:postId", authenticate, getPost);

// TODO: Create post
router.post("/", authenticate, upload.array("image", 12), createPost);

// TODO: Update post
router.patch("/update", authenticate, upload.array("image", 12), updatePost);

// TODO: Delete post
router.delete("/:id", authenticate, deletePost);

// TODO: Delete Image
router.delete("/delete-img/:id", authenticate, deleteImage);

module.exports = router;
