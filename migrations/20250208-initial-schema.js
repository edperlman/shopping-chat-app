// migrations/20250208010100-initial-schema.js
"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // If your .sql had CREATE TABLE "users" ...
    // replicate it in JS:
    await queryInterface.createTable("users", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW")
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW")
      }
    });
    // etc. for other tables 
  },

  async down(queryInterface) {
    await queryInterface.dropTable("users");
    // drop other tables if created
  }
};
