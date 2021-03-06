"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable("post_imgs", {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      img_url: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      post_id: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: {
            tableName: "posts",
          },
          key: "id",
        },
      },
      created_at: {
        type: Sequelize.DataTypes.DATE,
      },
      updated_at: {
        type: Sequelize.DataTypes.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable("post_imgs");
  },
};
