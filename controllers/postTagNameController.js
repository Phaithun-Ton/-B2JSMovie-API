const { TagName, Post, PostTagName } = require("../models");

// TODO: Get all post tag name
exports.getAllPostTagName = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const postTagName = await PostTagName.findAll({
      where: { postId },
      include: [
        {
          model: TagName,
        },
      ],
    });
    if (!postTagName) {
      return res.status(400).json({ message: "post id not found" });
    }
    res.status(200).json({ postTagName });
  } catch (err) {
    next(err);
  }
};

// TODO: Add post tag name
exports.addPostTagName = async (req, res, next) => {
  try {
    const { postId, tagNameId } = req.params;
    const postTagNames = await PostTagName.findOne({
      where: { postId, tagNameId },
    });
    if (postTagNames) {
      return res.status(400).json({ message: "post is already tag name" });
    }
    const post = await Post.findOne({ where: { id: postId } });
    if (!post) {
      return res.status(400).json({ message: "post id not found" });
    }
    if (req.user.id !== post.userId) {
      return res.status(400).json({ message: "you cannot edit this post" });
    }
    const tagName = await TagName.findAll({ where: { id: tagNameId } });
    if (!tagName) {
      return res.status(400).json({ message: "Tag name id not found" });
    }
    const postTagName = await PostTagName.create({
      postId,
      tagNameId,
    });
    res.status(201).json({ postTagName });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

// TODO: Delete post tag name
exports.deletePostTagName = async (req, res, next) => {
  try {
    const { postId, tagNameId } = req.params;
    const postTagNames = await PostTagName.findOne({
      where: { postId, tagNameId },
    });
    const post = await Post.findOne({ where: { id: postId } });
    if (!post) {
      return res.status(400).json({ message: "post id not found" });
    }
    if (!postTagNames) {
      return res.status(400).json({ message: "post not have tag name" });
    }
    const tagName = await TagName.findAll({ where: { id: tagNameId } });
    if (!tagName) {
      return res.status(400).json({ message: "Tag name id not found" });
    }
    await postTagNames.destroy({ where: { postId, tagNameId } });
    res.status(204).json();
  } catch (err) {
    console.log(err);
    next(err);
  }
};
