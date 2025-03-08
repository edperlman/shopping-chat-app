// migrations/YYYYMMDDHHMMSS-add-status-to-affiliatelinks.js
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableDesc = await queryInterface.describeTable('AffiliateLinks');

    if (!tableDesc.status) {
      await queryInterface.addColumn('AffiliateLinks', 'status', {
        type: Sequelize.STRING,
        defaultValue: 'ACTIVE',
        allowNull: false
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const tableDesc = await queryInterface.describeTable('AffiliateLinks');

    if (tableDesc.status) {
      await queryInterface.removeColumn('AffiliateLinks', 'status');
    }
  }
};
