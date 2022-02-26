const express = require("express");
const authenticate = require("../middlewares/authenticate");
const followController = require("../controllers/followController");

const router = express.Router();

router.get("/user/unknown", authenticate, followController.getUnknown);
router.get("/user", authenticate, followController.getAllFollows);
router.post("/user", authenticate, followController.followSomeone);
router.delete("/user/:followId", authenticate, followController.unfollow);

module.exports = router;
