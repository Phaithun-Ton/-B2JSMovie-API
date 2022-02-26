const fs = require("fs");
const cloudinary = require("cloudinary").v2;
const { User } = require("../models");

exports.updateProfileImg = (req, res, next) => {
  try {
    cloudinary.uploader.upload(req.file.path, async (err, result) => {
      if (err) return next(err);

      await User.update(
        { profileImg: result.secure_url },
        { where: { id: req.user.id } }
      );
      if (req.user.profileImg) {
        const splied = req.user.profileImg.split("/");
        cloudinary.uploader.destroy(splied[splied.length - 1].split(".")[0]);
      }
      fs.unlinkSync(req.file.path);
      res.json({
        message: "Upload profile image completed",
        profileImg: result.secure_url,
      });
    });
  } catch (err) {
    next(err);
  }
};

exports.getMe = (req, res, next) => {
  try {
    const { id, firstName, lastName, profileImg, email, role } = req.user;
    const user = { id, firstName, lastName, profileImg, email, role };
    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
};

exports.updateRoleOwner = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (role !== process.env.ROLE_SECRET_KEY_OWNER) {
      return res.status(400).json({ message: "invalid secret key" });
    }
    const user = await User.findOne({ where: { id: req.user.id } });
    if (user.role === process.env.ROLE_OWNER) {
      return res
        .status(400)
        .json({ message: "you already have permission owner" });
    }
    const checkOwner = await User.findAll({
      where: { role: process.env.ROLE_OWNER },
    });
    if (checkOwner.length > process.env.ROLE_OWNER_NUMBER - 1) {
      return res
        .status(400)
        .json({ message: `only ${process.env.ROLE_OWNER_NUMBER} role owner` });
    }
    await User.update(
      { role: process.env.ROLE_OWNER },
      { where: { id: req.user.id } }
    );
    const owner = await User.findOne({
      where: { id: req.user.id },
      attributes: ["id", "firstName", "lastName", "profileImg", "role"],
    });
    res.status(200).json({ message: "you have permission to owner", owner });
  } catch (err) {
    next(err);
  }
};

exports.chageRoleOwner = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (role !== process.env.ROLE_SECRET_KEY_OWNER) {
      return res.status(400).json({ message: "invalid secret key" });
    }
    const checkUser = await User.findOne({ where: { id: req.user.id } });
    if (checkUser.role === process.env.ROLE_USER) {
      return res
        .status(400)
        .json({ message: "you already have permission user" });
    }
    await User.update(
      { role: process.env.ROLE_USER },
      { where: { id: req.user.id } }
    );
    const user = await User.findOne({
      where: { id: req.user.id },
      attributes: ["id", "firstName", "lastName", "profileImg", "role"],
    });
    res.status(200).json({ message: "you have permission to User", user });
  } catch (err) {
    next(err);
  }
};

exports.updateRoleAdmin = async (req, res, next) => {
  try {
    const { role, userId } = req.body;
    const checkUserId = userId ?? null;
    if (checkUserId === "" || checkUserId === null) {
      return res.status(400).json({ message: "userId is require" });
    }
    if (role !== process.env.ROLE_SECRET_KEY_ADMIN) {
      return res.status(400).json({ message: "invalid secret key" });
    }
    if (req.user.role !== process.env.ROLE_OWNER) {
      return res.status(403).json({ message: "you not have permission" });
    }
    const admin = await User.findOne({ where: { id: userId } });
    if (!admin) {
      return res.status(400).json({ message: "userId not found" });
    }
    if (admin.role === process.env.ROLE_OWNER) {
      return res.status(400).json({ message: "user is permission owner" });
    }
    if (admin.role === process.env.ROLE_ADMIN) {
      return res
        .status(400)
        .json({ message: "user already have permission admin" });
    }
    const checkAdmin = await User.findAll({
      where: { role: process.env.ROLE_ADMIN },
    });
    if (checkAdmin.length > process.env.ROLE_ADMIN_NUMBER - 1) {
      return res
        .status(400)
        .json({ message: `only ${process.env.ROLE_ADMIN_NUMBER} role admin` });
    }
    await User.update(
      { role: process.env.ROLE_ADMIN },
      { where: { id: userId } }
    );
    const user = await User.findOne({
      where: { id: userId },
      attributes: ["id", "firstName", "lastName", "profileImg", "role"],
    });
    res.status(200).json({ message: "you have permission to Admin", user });
  } catch (err) {
    next(err);
  }
};

exports.chageRoleAdmin = async (req, res, next) => {
  try {
    const { role, userId } = req.body;
    const checkUserId = userId ?? null;
    if (checkUserId === "" || checkUserId === null) {
      return res.status(400).json({ message: "userId is require" });
    }
    if (role !== process.env.ROLE_SECRET_KEY_ADMIN) {
      return res.status(400).json({ message: "invalid secret key" });
    }
    if (req.user.role !== process.env.ROLE_OWNER) {
      return res.status(403).json({ message: "you not have permission" });
    }
    const checkUser = await User.findOne({ where: { id: userId } });
    if (!checkUser) {
      return res.status(400).json({ message: "userId not found" });
    }
    if (checkUser.role === process.env.ROLE_USER) {
      return res
        .status(400)
        .json({ message: "user already have permission user" });
    }
    await User.update(
      { role: process.env.ROLE_USER },
      { where: { id: userId } }
    );
    const user = await User.findOne({
      where: { id: userId },
      attributes: ["id", "firstName", "lastName", "profileImg", "role"],
    });
    res.status(200).json({ message: "you have permission to User", user });
  } catch (err) {
    next(err);
  }
};

exports.backListUser = async (req, res, next) => {
  try {
    const { userId } = req.body;
    if (
      req.user.role !== process.env.ROLE_ADMIN &&
      req.user.role !== process.env.ROLE_OWNER
    ) {
      return res.status(403).json({ message: "you not have permission" });
    }
    const checkUserId = userId ?? null;
    if (checkUserId === "" || checkUserId === null) {
      return res.status(400).json({ message: "userId is require" });
    }
    const user = await User.findOne({ where: { id: userId }, paranoid: false });
    if (!user) {
      return res.status(400).json({ message: "userId not found" });
    }
    if (user.deletedAt !== null) {
      return res.status(400).json({ message: "user is already in back list" });
    }
    user.destroy(
      { deletedAt: new Date().getDate() },
      { where: { id: userId }, force: true }
    );
    const userBan = await User.findOne({
      where: { id: userId },
      paranoid: false,
      attributes: ["id", "firstName", "lastName", "profileImg", "role"],
    });
    res.status(200).json({ message: "user move to back list", userBan });
  } catch (err) {
    next(err);
  }
};

exports.deleteBackListUser = async (req, res, next) => {
  try {
    const { userId } = req.body;
    if (
      req.user.role !== process.env.ROLE_ADMIN &&
      req.user.role !== process.env.ROLE_OWNER
    ) {
      return res.status(403).json({ message: "you not have permission" });
    }
    const checkUserId = userId ?? null;
    if (checkUserId === "" || checkUserId === null) {
      return res.status(400).json({ message: "userId is require" });
    }
    const user = await User.findOne({ where: { id: userId }, paranoid: false });
    if (!user) {
      return res.status(400).json({ message: "userId not found" });
    }
    if (user.deletedAt === null) {
      return res.status(400).json({ message: "user is not in back list" });
    }
    user.restore({ deletedAt: null }, { where: { id: userId } });
    const userUnban = await User.findOne({
      where: { id: userId },
      paranoid: false,
      attributes: ["id", "firstName", "lastName", "profileImg", "role"],
    });
    res.status(200).json({ message: "user is unban", userUnban });
  } catch (err) {
    next(err);
  }
};
