const express = require("express");
const authenticate = require("../middlewares/authenticate");
const {
  getUnknown,
  getAllFollows,
  followSomeone,
  unFollow,
} = require("../controllers/followController");

const router = express.Router();

// TODO: Get all user
router.get("/user/unknown", authenticate, getUnknown);

// TODO: Get all Follow
router.get("/user", authenticate, getAllFollows);

// TODO: Follow Someone
router.post("/:followId", authenticate, followSomeone);

// TODO: UnFollow
router.delete("/:followId", authenticate, unFollow);

module.exports = router;
