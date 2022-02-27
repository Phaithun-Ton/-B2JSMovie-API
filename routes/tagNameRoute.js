const express = require("express");
const authenticate = require("../middlewares/authenticate");
const {
  getAllTagName,
  getAllPostTagName,
  createTagName,
  updateTagName,
  deleteTagname,
} = require("../controllers/tagNameController");

const router = express.Router();

// TODO: Get all tag name
router.get("/", getAllTagName);

// TODO: Get all post tag name
router.get("/postTagNames", getAllPostTagName);

// TODO: Create tag name
router.post("/", authenticate, createTagName);

// TODO: Update tag name
router.patch("/", authenticate, updateTagName);

// TODO: Delete tag name
router.delete("/:tagNameId", authenticate, deleteTagname);

module.exports = router;
