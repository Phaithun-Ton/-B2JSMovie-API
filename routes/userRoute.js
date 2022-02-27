const express = require("express");
const authenticate = require("../middlewares/authenticate");
const { register, login } = require("../controllers/authController");
const {
  getMe,
  updateProfileImg,
  updateRoleOwner,
  changeRoleOwner,
  updateRoleAdmin,
  changeRoleAdmin,
  backListUser,
  deleteBackListUser,
} = require("../controllers/userController");
const upload = require("../middlewares/upload");

const router = express.Router();

// TODO: Get data user by yourself
router.get("/me", authenticate, getMe);

// TODO: Register
router.post("/register", register);

// TODO: Login
router.post("/login", login);

// TODO: Update user profile image
router.patch(
  "/profile-img",
  authenticate,
  upload.single("profileImg"),
  updateProfileImg
);
router.patch("/owner", authenticate, updateRoleOwner);
router.patch("/change-owner", authenticate, changeRoleOwner);

// TODO: Create admin role
router.patch("/admin", authenticate, updateRoleAdmin);

// TODO: Release admin role
router.patch("/change-admin", authenticate, changeRoleAdmin);

// TODO: Back list
router.patch("/back-list", authenticate, backListUser);

// TODO: UnBan
router.patch("/unBan", authenticate, deleteBackListUser);

module.exports = router;
