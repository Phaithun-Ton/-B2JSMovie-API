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
    await queryInterface.bulkInsert("follows", [
      {
        follow_id: 1,
        follower_id: 3,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        follow_id: 2,
        follower_id: 3,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        follow_id: 1,
        follower_id: 4,
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
    await queryInterface.bulkDelete("follows", null, {});
  },
};
