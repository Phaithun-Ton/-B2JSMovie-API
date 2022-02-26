"use strict";

const bcrypt = require("bcryptjs");
const { faker } = require("@faker-js/faker");

const users = [
  {
    first_name: "Jill",
    last_name: "Royce",
    email: "DIKJill@gmail.com",
    password: bcrypt.hashSync("Jillpass", 12),
    role: "USER",
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    first_name: "Bella",
    last_name: "Valentine",
    email: "DIKBella@gmail.com",
    password: bcrypt.hashSync("Bellapass", 12),
    role: "ADMIN",
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    first_name: "Arus",
    last_name: "Aly",
    email: "DIKArus@gmail.com",
    password: bcrypt.hashSync("Aruspass", 12),
    role: "ADMIN",
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    first_name: "Sage",
    last_name: "Bergrin",
    email: "DIKSage@gmail.com",
    password: bcrypt.hashSync("Sagepass", 12),
    role: "USER",
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    first_name: "Josy",
    last_name: "Redsen",
    email: "DIKJosy@gmail.com",
    password: bcrypt.hashSync("Josypass", 12),
    role: "USER",
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    first_name: "Maya",
    last_name: "Mary",
    email: "DIKMaya@gmail.com",
    password: bcrypt.hashSync("Mayapass", 12),
    role: "USER",
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    first_name: "Malisa",
    last_name: "Logus",
    email: "DIKMalisa@gmail.com",
    password: bcrypt.hashSync("Malisapass", 12),
    role: "USER",
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    first_name: "Jode",
    last_name: "Bergrin",
    email: "DIKJode@gmail.com",
    password: bcrypt.hashSync("Jodepass", 12),
    role: "USER",
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    first_name: "Drake",
    last_name: "Mary",
    email: "DIKDrake@gmail.com",
    password: bcrypt.hashSync("Drakepass", 12),
    role: "USER",
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    first_name: "Mona",
    last_name: "Rome",
    email: "DIKMona@gmail.com",
    password: bcrypt.hashSync("Monapass", 12),
    role: "USER",
    created_at: new Date(),
    updated_at: new Date(),
  },
];

for (let i = 0; i < 10; i++) {
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  const user = {
    first_name: firstName,
    last_name: lastName,
    profile_img: faker.image.avatar(),
    email: firstName + "." + lastName.slice(0, 2) + "@gmail.com",
    password: bcrypt.hashSync("123456", 12),
    role: "USER",
    created_at: new Date(),
    updated_at: new Date(),
  };
  users.push(user);
}

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    return await queryInterface.bulkInsert("users", users);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete("users", null, {});
  },
};
