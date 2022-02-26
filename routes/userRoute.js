const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/authenticate");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const upload = require("../middlewares/upload");

router.get("/me", authenticate, userController.getMe);
router.post("/register", authController.register);
router.post("/login", authController.login);
router.patch(
  "/profile-img",
  authenticate,
  upload.single("profileImg"),
  userController.updateProfileImg
);
router.patch("/owner", authenticate, userController.updateRoleOwner);
router.patch("/chage-owner", authenticate, userController.chageRoleOwner);
router.patch("/admin", authenticate, userController.updateRoleAdmin);
router.patch("/chage-admin", authenticate, userController.chageRoleAdmin);
router.patch("/back-list", authenticate, userController.backListUser);
router.patch("/unban", authenticate, userController.deleteBackListUser);

module.exports = router;
