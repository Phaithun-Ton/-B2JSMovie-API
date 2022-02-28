const { Op } = require("sequelize");
const { Follow, User } = require("../models");

// TODO: Get all user
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
      include: [
        {
          as: "follow",
          model: Follow,
        },
      ],
      attributes: {
        exclude: ["password", "email", "createdAt", "updatedAt", "deletedAt"],
      },
    });
    res.status(200).json({ users });
  } catch (err) {
    next(err);
  }
};

// TODO: Get all Follow
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
      include: [
        {
          as: "follow",
          model: Follow,
        },
      ],
      attributes: {
        exclude: ["password", "email", "createdAt", "updatedAt", "deletedAt"],
      },
    });
    res.status(200).json({ users });
  } catch (err) {
    next(err);
  }
};

// TODO: Follow Someone
exports.followSomeone = async (req, res, next) => {
  try {
    const { followId } = req.params;

    // ? Validate follow id
    if (typeof followId !== "string" || followId.trim() === "") {
      return res.status(400).json({ message: "Follow Id is require" });
    }

    // ? Validate if user try to follow yourself
    if (req.user.id === followId) {
      return res.status(400).json({ message: "cannot follow yourself" });
    }

    // ? Find user
    const user = await User.findOne({ where: { id: followId } });
    if (!user) {
      return res.status(400).json({ message: "followId user not found" });
    }

    // ? Validate if user already follow
    const existFollow = await Follow.findOne({
      where: { followerId: req.user.id, followId },
    });
    if (existFollow) {
      return res
        .status(400)
        .json({ message: "This user has already been follow" });
    }

    // * Follow
    await Follow.create({
      followId,
      followerId: req.user.id,
    });
    res.status(200).json({ message: "follow success" });
  } catch (err) {
    next(err);
  }
};

// TODO: UnFollow
exports.unFollow = async (req, res, next) => {
  try {
    const { followId } = req.params;

    // ? Validate follow id
    if (typeof followId !== "string" || followId.trim() === "") {
      return res.status(400).json({ message: "follow id is require" });
    }

    // ? Find user
    const user = await User.findOne({ where: { id: followId } });
    if (!user) {
      return res.status(400).json({ message: "followId user not found" });
    }

    // ? Validate if user is not follow
    const follow = await Follow.findOne({
      where: { followerId: req.user.id, followId },
    });
    if (!follow) {
      return res.status(400).json({ message: "you not follow this user" });
    }

    // * UnFollow
    await follow.destroy();
    res.status(204).json();
  } catch (err) {
    next(err);
  }
};
