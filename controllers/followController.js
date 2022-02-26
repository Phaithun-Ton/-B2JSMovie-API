const { Op } = require("sequelize");
const { Follow, User } = require("../models");

exports.getUnknown = async (req, res, next) => {
  try {
    const follows = await Follow.findAll({
      where: {
        [Op.or]: [{ followId: req.user.id }, { followerId: req.user.id }],
      },
    });
    const followIds = follows.reduce(
      (acc, item) => {
        if (req.user.id === item.followerId) {
          acc.push(item.followId);
        } else {
          acc.push(item.followerId);
        }
        return acc;
      },
      [req.user.id]
    );
    const users = await User.findAll({
      where: {
        id: {
          [Op.notIn]: followIds,
        },
      },
      attributes: {
        exclude: ["password", "email", "createdAt", "updatedAt", "deletedAt"],
      },
    });
    res.status(200).json({ users });
  } catch (err) {
    next(err);
  }
};

exports.getAllFollows = async (req, res, next) => {
  try {
    const { searchName } = req.query;
    const follows = await Follow.findAll({
      where: { followerId: req.user.id },
    });
    const followIds = follows.reduce((acc, item) => {
      if (req.user.id === item.followerId) {
        acc.push(item.followId);
      }
      return acc;
    }, []);
    let userWhere = {};
    if (searchName) {
      userWhere = {
        [Op.or]: [
          {
            firstName: {
              [Op.substring]: searchName,
            },
          },
          {
            lastName: {
              [Op.substring]: searchName,
            },
          },
        ],
      };
    }
    const users = await User.findAll({
      where: {
        id: followIds,
        ...userWhere,
      },
      attributes: {
        exclude: ["password", "email", "createdAt", "updatedAt", "deletedAt"],
      },
    });
    res.status(200).json({ users });
  } catch (err) {
    next(err);
  }
};

exports.followSomeone = async (req, res, next) => {
  try {
    const { followId } = req.body;
    const checkFollowId = followId ?? null;
    if (checkFollowId === "" || checkFollowId === null) {
      return res.status(400).json({ message: "followId is require" });
    }
    if (req.user.id === followId) {
      return res.status(400).json({ message: "connot follow youself" });
    }
    const user = await User.findOne({ where: { id: followId } });
    if (!user) {
      return res.status(400).json({ message: "followId user not found" });
    }
    const existFollow = await Follow.findOne({
      where: { followerId: req.user.id, followId },
    });
    if (existFollow) {
      return res
        .status(400)
        .json({ message: "This user has already been follow" });
    }
    await Follow.create({
      followId,
      followerId: req.user.id,
    });
    res.status(200).json({ message: "follow success" });
  } catch (err) {
    next(err);
  }
};

exports.unfollow = async (req, res, next) => {
  try {
    const { followId } = req.params;
    const user = await User.findOne({ where: { id: followId } });
    if (!user) {
      return res.status(400).json({ message: "followId user not found" });
    }
    const follow = await Follow.findOne({
      where: { followerId: req.user.id, followId },
    });
    if (!follow) {
      return res.status(400).json({ message: "you not follow this user" });
    }
    await follow.destroy();
    res.status(204).json();
  } catch (err) {
    next(err);
  }
};
