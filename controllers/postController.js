const fs = require("fs");
const util = require("util");
const cloudinary = require("cloudinary").v2;
const { Op } = require("sequelize");
const {
  Post,
  Like,
  Comment,
  Follow,
  User,
  PostImg,
  TagName,
  PostTagName,
  sequelize,
} = require("../models");

const uploadPromise = util.promisify(cloudinary.uploader.upload);

// TODO: Get all post
exports.getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.findAll({
      where: {},
      include: [
        {
          model: User,
          attributes: ["id", "firstName", "lastName", "profileImg"],
        },
        {
          model: Comment,
          include: {
            model: User,
            attributes: ["id", "firstName", "lastName", "profileImg"],
          },
        },
        {
          model: PostTagName,
          include: {
            model: TagName,
            attributes: ["title", "description"],
          },
        },
        {
          model: PostImg,
        },
        {
          model: Like,
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json({ posts });
  } catch (err) {
    next(err);
  }
};

// TODO: Get post by user
exports.getPostByUser = async (req, res, next) => {
  try {
    const posts = await Post.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: User,
          attributes: ["id", "firstName", "lastName", "profileImg"],
        },
        {
          model: Comment,
          include: {
            model: User,
            attributes: ["id", "firstName", "lastName", "profileImg"],
          },
        },
        {
          model: PostTagName,
          include: {
            model: TagName,
            attributes: ["title", "description"],
          },
        },
        {
          model: PostImg,
        },
        {
          model: Like,
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.status(201).json({ posts });
  } catch (err) {
    next(err);
  }
};

// TODO: Get post
exports.getPost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const post = await Post.findOne({
      where: { id: postId },
      include: [
        {
          model: User,
          attributes: ["id", "firstName", "lastName", "profileImg"],
          include: {
            as: "follow",
            model: Follow,
          },
        },
        {
          model: Comment,
          include: {
            model: User,
            attributes: ["id", "firstName", "lastName", "profileImg"],
          },
        },
        {
          model: PostTagName,
          include: {
            model: TagName,
            attributes: ["title", "description"],
          },
        },
        {
          model: PostImg,
        },
        {
          model: Like,
        },
      ],
    });
    if (!post) {
      return res.status(400).json({ message: "post not found" });
    }
    res.status(200).json({ post });
  } catch (err) {
    next(err);
  }
};

// TODO: Create post
exports.createPost = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { title, content, tagNameId } = req.body;

    // ? Validate data
    if (!title && !req.files && !content) {
      return res
        .status(400)
        .json({ message: "title or image or content is require" });
    }

    // ? Validate tag name
    if (tagNameId.length === 0) {
      return res.status(400).json({ message: "tag name id is require" });
    }

    // ? Find Tag Name
    const tagNames = await TagName.findAll({
      where: { id: tagNameId },
    });
    if (!tagNames) {
      return res.status(400).json({ message: "Tag name not found" });
    }

    // * Create post
    const post = await Post.create(
      {
        title: title ?? null,
        content: content ?? null,
        userId: req.user.id,
      },
      { transaction }
    );

    // * Create post tag name
    for (const postTagName of tagNames) {
      await PostTagName.create(
        {
          postId: post.id,
          tagNameId: postTagName.id,
        },
        { transaction }
      );
    }

    // ? Upload File
    let result = {};
    let tmp = [];

    if (req.files) {
      for (const file of req.files) {
        const { path } = file;
        result = await uploadPromise(path);
        fs.unlinkSync(path);

        // * Create post img
        const postImg = await PostImg.create(
          {
            imgUrl: result.secure_url,
            postId: post.id,
          },
          { transaction }
        );
        tmp.push(postImg);
      }
    }
    await transaction.commit();
    res.status(201).json({ post, tmp });
  } catch (err) {
    await transaction.rollback();
    next(err);
  }
};

// TODO: Update post
exports.updatePost = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { title, content, postId, tagNameId } = req.body;

    // ? Validate post id
    if (typeof postId !== "string" || postId.trim() === "") {
      return res.status(400).json({ message: "post id is require" });
    }

    // ? Validate tag name
    if (typeof tagNameId !== "string" || tagNameId.trim() === "") {
      return res.status(400).json({ message: "tag name id is require" });
    }

    // ? Find Post
    const post = await Post.findOne({ where: { id: postId } }, { transaction });
    if (!post) {
      return res.status(400).json({ message: "post id not found" });
    }

    // ? Validate user
    if (req.user.id !== post.userId) {
      return res.status(400).json({ message: "you do not have permission" });
    }

    // ? Validate before update
    if (!title && !req.files && !content) {
      return res
        .status(400)
        .json({ message: "title or content or image or tag name is require" });
    }

    // ? Find Tag Name
    const tagNames = await TagName.findAll(
      {
        where: { id: tagNameId },
      },
      { transaction }
    );
    if (!tagNames) {
      return res.status(400).json({ message: "Tag name not found" });
    }

    // ? Find Post Tag Name
    const postTagName = await PostTagName.findAll(
      { where: { postId } },
      { transaction }
    );
    if (!postTagName) {
      return res.status(400).json({ message: "post id not found" });
    }

    // * Delete post tag name
    for (const item of postTagName) {
      await item.destroy({}, { transaction });
    }

    console.log(typeof tagNames);

    // * create post tag name
    for (const postTagName of tagNames) {
      await PostTagName.create(
        {
          postId: post.id,
          tagNameId: postTagName.id,
        },
        { transaction }
      );
    }

    let result = {};
    let tmp = [];
    if (req.files) {
      for (const file of req.files) {
        const { path } = file;
        result = await uploadPromise(path);
        fs.unlinkSync(path);
        const postImg = await PostImg.create(
          {
            imgUrl: result.secure_url,
            postId: postId,
          },
          { where: { postId } },
          { transaction }
        );
        tmp.push(postImg);
      }
    }
    const checkTitle = title ?? post.title;
    const checkContent = content ?? post.content;
    await post.update(
      {
        userId: req.user.id,
        title: checkTitle,
        content: checkContent,
      },
      { transaction }
    );
    await transaction.commit();
    res.status(201).json({ tmp, post });
  } catch (err) {
    await transaction.rollback();
    next(err);
  }
};

// TODO: Delete post
exports.deletePost = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    const user = await Post.findOne({ where: { userId: req.user.id } });
    if (
      !user &&
      req.user.role !== process.env.ROLE_ADMIN &&
      req.user.role !== process.env.ROLE_OWNER
    ) {
      return res.status(400).json({ message: "you cannot delete this post" });
    }
    const post = await Post.findOne({ where: { id } }, { transaction });
    if (!post) {
      return res.status(400).json({ message: "post not found" });
    }
    const postImg = await PostImg.findAll(
      { where: { postId: post.id } },
      { transaction }
    );
    for (const file of postImg) {
      const splied = await file.imgUrl.split("/");
      cloudinary.uploader.destroy(splied[splied.length - 1].split(".")[0]);
      await PostImg.destroy({ where: { postId: id } }, { transaction });
    }
    await Like.destroy({ where: { postId: id } }, { transaction });
    await Comment.destroy({ where: { postId: id } }, { transaction });
    await PostTagName.destroy({ where: { postId: id } }, { transaction });
    await Post.destroy({ where: { id } }, { transaction });
    await transaction.commit();
    res.status(204).json();
  } catch (err) {
    await transaction.rollback();
    next(err);
  }
};

// TODO: Delete post
exports.deleteImage = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;

    // ? Validate img url
    if (typeof id !== "string" || id.trim() === "") {
      return res.status(400).json({ message: "post image id is require" });
    }

    // ? Find Post Image
    const postImage = await PostImg.findOne({ where: { id } }, { transaction });
    if (!postImage) {
      return res.status(400).json({ message: "post image not found" });
    }

    // ? Find Post
    const post = await Post.findOne(
      { where: { id: postImage.postId } },
      { transaction }
    );
    if (!post) {
      return res.status(400).json({ message: "post not found" });
    }

    // ? Validate user
    if (req.user.id !== post.userId) {
      return res.status(400).json({ message: "you do not have permission" });
    }

    // * Delete post image
    const splied = await postImage.imgUrl.split("/");
    cloudinary.uploader.destroy(splied[splied.length - 1].split(".")[0]);
    await postImage.destroy();

    await transaction.commit();
    res.status(204).json();
  } catch (err) {
    await transaction.rollback();
    next(err);
  }
};
