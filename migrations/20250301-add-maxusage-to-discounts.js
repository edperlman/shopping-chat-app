module.exports = {
    async up(queryInterface, Sequelize) {
      await queryInterface.addColumn('Discounts', 'max_usage', {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: null
      });
    },
  
    async down(queryInterface, Sequelize) {
      await queryInterface.removeColumn('Discounts', 'max_usage');
    }
  };
  