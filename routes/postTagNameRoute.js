const express = require("express");
const authenticate = require("../middlewares/authenticate");
const postTagNameController = require("../controllers/postTagNameController");

const router = express.Router();

router.get("/:postId", authenticate, postTagNameController.getAllPostTagName);
router.post(
  "/:postId/:tagNameId",
  authenticate,
  postTagNameController.addPostTagName
);
router.delete(
  "/:postId/:tagNameId",
  authenticate,
  postTagNameController.deletePostTagName
);

module.exports = router;
