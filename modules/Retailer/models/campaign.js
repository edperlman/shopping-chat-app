/**
 * modules/Retailer/models/campaign.js
 *
 * Renamed influencer_user_id -> user_id, so the aggregator can store any user’s ID
 * (regular or influencer). We allowNull: false if you want an always-required user ID.
 */
module.exports = (sequelize, DataTypes) => {
  const Campaign = sequelize.define('Campaign', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    // RENAMED:
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false // or true, if you prefer to make it optional
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
    // discount_id references "Discounts" if you use a separate table
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
    timestamps: false,
    underscored: true
  });

  Campaign.associate = (models) => {
    // Link to Retailer
    Campaign.belongsTo(models.Retailer, {
      foreignKey: 'retailer_id',
      as: 'retailer'
    });
    // Link to User for the campaign creator (regular or influencer)
    Campaign.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'creatorUser' // e.g. 'creatorUser'
    });
    // Link to Discount if separate
    Campaign.belongsTo(models.Discount, {
      foreignKey: 'discount_id',
      as: 'discount'
    });
  };

  return Campaign;
};
