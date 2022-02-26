const express = require("express");
const authenticate = require("../middlewares/authenticate");
const postController = require("../controllers/postController");
const upload = require("../middlewares/upload");

const router = express.Router();

router.get("/", authenticate, postController.getAllPosts);
router.get("/postByUser", authenticate, postController.getPostByUser);
router.get("/:postId", authenticate, postController.getPost);
router.post(
  "/",
  authenticate,
  upload.array("image", 12),
  postController.createPost
);
router.patch(
  "/:postId",
  authenticate,
  upload.array("image", 12),
  postController.updatePost
);
router.delete("/:id", authenticate, postController.deletePost);

module.exports = router;
