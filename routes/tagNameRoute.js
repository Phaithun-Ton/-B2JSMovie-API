const express = require("express");
const authenticate = require("../middlewares/authenticate");
const tagNameController = require("../controllers/tagNameController");

const router = express.Router();

router.get("/", tagNameController.getAllTagName);
router.get("/postTagNames", tagNameController.getAllPostTagName);
router.post("/", authenticate, tagNameController.createTagName);
router.patch("/", authenticate, tagNameController.updateTagName);
router.delete("/:tagNameId", authenticate, tagNameController.deleteTagname);

module.exports = router;
