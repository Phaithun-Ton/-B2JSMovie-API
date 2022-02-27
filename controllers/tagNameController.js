const { TagName, PostTagName, Post, PostImg, User } = require("../models");

// TODO: Get all tag name
exports.getAllTagName = async (req, res, next) => {
  try {
    const tagNames = await TagName.findAll();
    res.status(200).json({ tagNames });
  } catch (err) {
    next(err);
  }
};

// TODO: Get all post tag name
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
      order: [["id", "DESC"]],
    });

    res.status(200).json({ tagNames });
  } catch (err) {
    next(err);
  }
};

// TODO: Create tag name
exports.createTagName = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    if (
      req.user.role !== process.env.ROLE_ADMIN &&
      req.user.role !== process.env.ROLE_OWNER
    ) {
      return res.status(403).json({ message: "you do not have permission" });
    }

    // ? Validate title
    if (typeof title !== "string" || title.trim() === "") {
      return res.status(400).json({ message: "title is require" });
    }

    // * Create tag name
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

// TODO: Update tag name
exports.updateTagName = async (req, res, next) => {
  try {
    const { title, description, tagNameId } = req.body;
    if (
      req.user.role !== process.env.ROLE_ADMIN &&
      req.user.role !== process.env.ROLE_OWNER
    ) {
      return res.status(403).json({ message: "you do not have permission" });
    }

    // ? Validate tag name id
    if (typeof tagNameId !== "number") {
      return res.status(400).json({ message: "tag name id is require" });
    }
    const tagName = await TagName.findOne({ where: { id: tagNameId } });
    if (!tagName) {
      return res.status(400).json({ message: "tag name id not found" });
    }

    // * Update tag name
    await tagName.update({
      title: title ?? tagName.title,
      description: description ?? tagName.description,
    });

    res.status(200).json({ message: "update success", tagName });
  } catch (err) {
    next(err);
  }
};

// TODO: Delete tag name
exports.deleteTagname = async (req, res, next) => {
  try {
    const { tagNameId } = req.params;
    if (
      req.user.role !== process.env.ROLE_ADMIN &&
      req.user.role !== process.env.ROLE_OWNER
    ) {
      return res.status(403).json({ message: "you do not have permission" });
    }

    // ? Validate tag name id
    if (typeof tagNameId !== "string" || tagNameId.trim() === "") {
      return res.status(400).json({ message: "tag name id is require" });
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
