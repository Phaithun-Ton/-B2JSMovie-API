const express = require("express");
const authenticate = require("../middlewares/authenticate");
const likeController = require("../controllers/likeController");

const router = express.Router();

router.post("/", authenticate, likeController.createLike);
router.delete("/:id", authenticate, likeController.unLike);

module.exports = router;
