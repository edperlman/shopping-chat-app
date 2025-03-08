/******************************************************************************
 * modules/Affiliate/models/affiliateLink.js
 *
 * Store affiliate link data: user_id, discount_id, usage_count, status,
 * commission_rate, affiliate_code, etc.
 ******************************************************************************/
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
    // ADD THIS affiliate_code field that wasn't present before
    affiliate_code: {
      type: DataTypes.STRING,
      allowNull: false // Not null constraint in DB
    },
    usage_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'ACTIVE',
      allowNull: false
    },
    commission_rate: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0.10,
      allowNull: false
    },
    notes: {
      type: DataTypes.TEXT,
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
    tableName: 'AffiliateLinks',
    underscored: true,
    timestamps: false
  });

  AffiliateLink.associate = (models) => {
    // If you want to link to a discount model or user model
    // e.g. AffiliateLink.belongsTo(models.Discount, { foreignKey: 'discount_id' });
  };

  return AffiliateLink;
};
