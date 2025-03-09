// File: src/models/affiliateLink.js

module.exports = (sequelize, DataTypes) => {
    const AffiliateLink = sequelize.define('AffiliateLink', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      discount_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      campaign_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      affiliate_code: {
        type: DataTypes.STRING,
        allowNull: false
      },

      usage_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      
      notes: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    }, {
      tableName: 'AffiliateLinks',
  
      // The following lines ensure Sequelize maps `createdAt` -> `created_at`, `updatedAt` -> `updated_at`
      timestamps: true,
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    });
  
    AffiliateLink.associate = (models) => {
      AffiliateLink.belongsTo(models.User, { foreignKey: 'user_id' });
      AffiliateLink.belongsTo(models.Discount, { foreignKey: 'discount_id' });
      AffiliateLink.belongsTo(models.Campaign, { foreignKey: 'campaign_id' });
    };
  
    return AffiliateLink;
  };
  