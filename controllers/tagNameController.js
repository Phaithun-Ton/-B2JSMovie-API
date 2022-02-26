const { TagName, PostTagName, Post, PostImg, User } = require("../models");

exports.getAllTagName = async (req, res, next) => {
  try {
    const tagNames = await TagName.findAll();
    res.status(200).json({ tagNames });
  } catch (err) {
    next(err);
  }
};

exports.getAllPostTagName = async (req, res, next) => {
  try {
    const tagNames = await TagName.findAll({
      where: {},
      include: [
        {
          model: PostTagName,
          include: {
            model: Post,
            include: {
              model: PostImg,
              model: User,
              attributes: ["id", "firstName", "lastName", "profileImg"],
            },
          },
        },
      ],
    });

    res.status(200).json({ tagNames });
  } catch (err) {
    next(err);
  }
};

exports.createTagName = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    if (
      req.user.role !== process.env.ROLE_ADMIN &&
      req.user.role !== process.env.ROLE_OWNER
    ) {
      return res.status(403).json({ message: "you not have permission" });
    }
    const checkTitle = title ?? null;
    if (checkTitle === "" || checkTitle === null) {
      return res.status(400).json({ message: "title is require" });
    }
    if (typeof title !== "string") {
      return res.status(400).json({ message: "title must be a string" });
    }
    const tagName = await TagName.create({
      title,
      description: description ?? null,
      userId: req.user.id,
    });
    res.status(201).json({ message: "Tag name created", tagName });
  } catch (err) {
    next(err);
  }
};

exports.updateTagName = async (req, res, next) => {
  try {
    const { title, description, tagNameId } = req.body;
    if (
      req.user.role !== process.env.ROLE_ADMIN &&
      req.user.role !== process.env.ROLE_OWNER
    ) {
      return res.status(403).json({ message: "you not have permission" });
    }
    const tagName = await TagName.findOne({ where: { id: tagNameId } });
    if (!tagName) {
      return res.status(400).json({ message: "tag name id not found" });
    }
    await TagName.update(
      {
        title: title ?? tagName.title,
        description: description ?? tagName.description,
      },
      { where: { id: tagNameId } }
    );
    const newTagName = await TagName.findOne({ where: { id: tagNameId } });
    res.status(200).json({
      message: "update success",
      title: newTagName.title,
      description: newTagName.description,
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteTagname = async (req, res, next) => {
  try {
    const { tagNameId } = req.params;
    if (
      req.user.role !== process.env.ROLE_ADMIN &&
      req.user.role !== process.env.ROLE_OWNER
    ) {
      return res.status(403).json({ message: "you not have permission" });
    }
    const tagName = await TagName.findOne({ where: { id: tagNameId } });
    if (!tagName) {
      return res.status(400).json({ message: "tag name id not found" });
    }
    await tagName.destroy();
    res.status(204).json();
  } catch (err) {
    next(err);
  }
};
