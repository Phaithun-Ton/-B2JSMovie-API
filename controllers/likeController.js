const { Post, Like } = require("../models");

// TODO: Find like by user
exports.findLikeByUser = async (req, res, next) => {
  try {
    const { postId } = req.params;

    // ? Validate post id
    if (typeof postId !== "string" || postId.trim() === "") {
      return res.status(400).json({ message: "post id is require" });
    }
    const like = await Like.findOne({ where: { userId: req.user.id, postId } });
    if (!like) {
      return res.status(400).json({ message: "like not found" });
    }
    res.status(200).json({ like });
  } catch (err) {
    next(err);
  }
};

// TODO: Like post
exports.createLike = async (req, res, next) => {
  try {
    const { postId } = req.params;

    // ? Validate post id
    if (typeof postId !== "string" || postId.trim() === "") {
      return res.status(400).json({ message: "post id is require" });
    }

    // ? Find post
    const post = await Post.findOne({ where: { id: postId } });
    if (!post) {
      return res.status(400).json({ message: "Post not found" });
    }

    // ? Find like
    const like = await Like.findOne({ where: { postId, userId: req.user.id } });
    if (like) {
      return res
        .status(400)
        .json({ message: "you have already like this post" });
    }

    // * create like
    await Like.create({
      postId,
      userId: req.user.id,
    });
    res.status(201).json({ message: "success like" });
  } catch (err) {
    next(err);
  }
};

// TODO: Unlike post
exports.unLike = async (req, res, next) => {
  try {
    const { postId } = req.params;

    // ? Validate post id
    if (typeof postId !== "string" || postId.trim() === "") {
      return res.status(400).json({ message: "post id is require" });
    }

    // ? Find like
    const like = await Like.findOne({ where: { postId, userId: req.user.id } });
    if (!like) {
      return res.status(400).json({ message: "like not found" });
    }
    if (req.user.id !== like.userId) {
      return res.status(403).json({ message: "you do not have permission" });
    }

    // * Unlike
    await like.destroy();
    res.status(204).json();
  } catch (err) {
    next(err);
  }
};
