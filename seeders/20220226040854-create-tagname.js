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
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: "Drama",
        user_id: 3,
        description: "Drama movie",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: "Action",
        user_id: 3,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: "Comedy",
        user_id: 3,
        created_at: new Date(),
        updated_at: new Date(),
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
