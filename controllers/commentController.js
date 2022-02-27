const { Post, Comment, User } = require("../models");

// TODO: Create Comment
exports.createComment = async (req, res, next) => {
  try {
    const { title, postId } = req.body;

    // ? Find post
    const post = await Post.findOne({ where: { id: postId } });
    if (!post) {
      return res.status(400).json({ message: "Post not found" });
    }

    // ? Validate title
    if (typeof title !== "string" || title.trim() === "") {
      return res.status(400).json({ message: "title is request" });
    }

    // * Create comment
    const comment = await Comment.create({
      title,
      postId,
      userId: req.user.id,
    });

    const findComment = await Comment.findOne({
      where: {
        id: comment.id,
      },
      include: {
        model: User,
        attributes: ["id", "firstName", "lastName", "profileImg"],
      },
    });
    res.status(201).json({ comment: findComment });
  } catch (err) {
    next(err);
  }
};

// TODO: Update Comment
exports.updateComment = async (req, res, next) => {
  try {
    const { title } = req.body;
    const { id } = req.params;
    const comment = await Comment.findOne({ where: { id } });
    if (!comment) {
      return res.status(400).json({ message: "comment not found" });
    }
    if (req.user.id !== comment.userId) {
      return res
        .status(403)
        .json({ message: "you cannot delete this comment" });
    }
    const checkTitle = title ? title.trim() : null;
    if (!checkTitle) {
      return res.status(400).json({ message: "title is request" });
    }
    const newComment = await Comment.update({ title }, { where: { id } });

    res.status(201).json({ title });
  } catch (err) {
    next(err);
  }
};

// TODO: Delete Comment
exports.deleteComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const comment = await Comment.findOne({ where: { id } });
    if (!comment) {
      return res.status(400).json({ message: "comment not found" });
    }
    if (
      req.user.id !== comment.userId &&
      req.user.role !== process.env.ROLE_ADMIN &&
      req.user.role !== process.env.ROLE_OWNER
    ) {
      return res
        .status(403)
        .json({ message: "you cannot delete this comment" });
    }
    await comment.destroy();
    res.status(204).json();
  } catch (err) {
    next(err);
  }
};
