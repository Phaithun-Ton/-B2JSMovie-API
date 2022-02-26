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

exports.createPost = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { title, content } = req.body;
    const { tagName } = req.query;
    if (!title && !req.files && !content) {
      return res
        .status(400)
        .json({ message: "title or image or content is request" });
    }
    const tagNames = await TagName.findAll({
      where: { title: tagName ?? "No Tag Name" },
    });
    if (!tagNames) {
      return res.status(400).json({ message: "title tag name not found" });
    }
    let result = {};
    let tmp = [];
    const post = await Post.create(
      {
        title,
        content,
        userId: req.user.id,
      },
      { transaction }
    );

    for (const postTagName of tagNames) {
      await PostTagName.create(
        {
          postId: post.id,
          tagNameId: postTagName.id,
        },
        { transaction }
      );
    }

    // console.log(req);
    console.log(req.body.image);

    if (req.files) {
      for (const file of req.files) {
        const { path } = file;
        result = await uploadPromise(path);
        fs.unlinkSync(path);
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

exports.updatePost = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { title, content } = req.body;
    const check = content ? content.trim() : null;
    const { postId } = req.params;
    const { tagName, chageTagName } = req.query;
    const post = await Post.findOne({ where: { id: postId } });
    if (!post) {
      return res.status(400).json({ message: "post id not found" });
    }
    if (req.user.id !== post.userId) {
      return res.status(400).json({ message: "you cannot edit this post" });
    }
    if (!title && !req.files && !tagName && !check) {
      return res
        .status(400)
        .json({ message: "title or image or tag name is request" });
    }
    if (tagName) {
      const oldTag = await TagName.findOne({ where: { title: tagName } });
      const newTag = await TagName.findOne({ where: { title: chageTagName } });
      if (!oldTag || !newTag) {
        return res.status(400).json({ message: "title tag name not found" });
      }
      const postTagNames = await PostTagName.findOne({
        where: { tagNameId: oldTag.id, postId },
      });
      if (!postTagNames) {
        return res.status(400).json({ message: "post tag name id not found" });
      }
      if (tagName && chageTagName) {
        await PostTagName.update(
          {
            tagNameId: newTag.id,
          },
          { where: { tagNameId: oldTag.id, postId } },
          { transaction }
        );
      }
    }
    let result = {};
    let tmp = [];
    const postImgs = await PostImg.findAll(
      { where: { postId } },
      { transaction }
    );
    if (req.files) {
      for (const img of postImgs) {
        const splied = await img.imgUrl.split("/");
        cloudinary.uploader.destroy(splied[splied.length - 1].split(".")[0]);
        await PostImg.destroy({ where: { postId } }, { transaction });
      }
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
    const newPost = await Post.update(
      {
        userId: req.user.id,
        title: checkTitle,
        content: checkContent,
        img: result.secure_url,
      },
      { where: { id: postId } }
    );
    await transaction.commit();
    res.status(201).json({ tmp, post });
  } catch (err) {
    await transaction.rollback();
    next(err);
  }
};

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
