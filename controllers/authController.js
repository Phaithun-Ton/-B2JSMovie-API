const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

const emailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

exports.register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, confirmPassword } = req.body;
    console.log(password);
    if (password.length <= 6) {
      return res
        .status(400)
        .json({ message: "password must be length more than 5" });
    }
    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ message: "password and confirmPassword did not match" });
    }
    if (email === "" || email.trim() === "") {
      return res.status(400).json({ message: "email is require" });
    }
    const isEmail = emailFormat.test(email);
    if (isEmail) {
      const emailAlready = await User.findOne({
        where: { email },
      });
      if (emailAlready) {
        return res
          .status(400)
          .json({ message: "This email is already in use" });
      }
    }
    const hasdedPassword = await bcrypt.hash(password, 12);
    await User.create({
      firstName,
      lastName,
      email,
      password: hasdedPassword,
    });
    res.status(201).json({
      message: "user created",
      firstName,
      lastName,
      email,
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const isEmail = emailFormat.test(email);
    if (email === "" || email.trim() === "") {
      return res.status(400).json({ message: "email is require" });
    }
    let user;
    if (isEmail) {
      user = await User.findOne({ where: { email: email } });
      if (!user) {
        return res.status(400).json({ message: "invalid email or password" });
      }
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "invalid email or password" });
    }
    const payload = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: 60 * 60 * 24 * 30,
    });
    const { id, firstName, lastName, profileImg, role } = user;
    res.status(200).json({
      message: "welcome",
      token,
      user: {
        id,
        firstName,
        lastName,
        profileImg,
        email,
        role,
      },
    });
  } catch (err) {
    next(err);
  }
};
