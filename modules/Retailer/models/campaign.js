/**
 * modules/Retailer/models/campaign.js
 *
 * Classic define approach for "Campaigns" table, now including discount_id
 * referencing "Discounts"(id). 
 */
module.exports = (sequelize, DataTypes) => {
  const Campaign = sequelize.define('Campaign', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    influencer_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    retailer_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pending'
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    commission_rate: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true
    },
    // NEW: Let Sequelize know about the discount_id column
    discount_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },

    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'Campaigns',
    timestamps: false, // or true if you want Sequelize to auto-manage createdAt/updatedAt
    underscored: true
  });

  // Associations
  Campaign.associate = (models) => {
    // Link to Retailer
    Campaign.belongsTo(models.Retailer, {
      foreignKey: 'retailer_id',
      as: 'retailer'
    });
    // Link to User for influencer
    Campaign.belongsTo(models.User, {
      foreignKey: 'influencer_user_id',
      as: 'influencerUser'
    });
    // NEW: Link to Discount, referencing discount_id
    Campaign.belongsTo(models.Discount, {
      foreignKey: 'discount_id',
      as: 'discount'
    });
  };

  return Campaign;
};
