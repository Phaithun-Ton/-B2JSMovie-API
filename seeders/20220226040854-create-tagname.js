"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert("tag_names", [
      {
        title: "No Tag Name",
        user_id: 3,
      },
      {
        title: "Drama",
        user_id: 3,
        description: "Drama movie",
      },
      {
        title: "Action",
        user_id: 3,
      },
      {
        title: "Comedy",
        user_id: 3,
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("tag_names", null, {});
  },
};
