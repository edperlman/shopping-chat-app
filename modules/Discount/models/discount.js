/******************************************************************************
 * modules/Discount/models/discount.js
 *
 * Function-based model definition for "Discount".
 ******************************************************************************/
module.exports = (sequelize, DataTypes) => {
  const Discount = sequelize.define('Discount', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    retailer_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'personal'
    },
    discount_percentage: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    start_time: {
      type: DataTypes.DATE
    },
    end_time: {
      type: DataTypes.DATE
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'pending'
    },
    usage_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    max_usage: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null // if null => unlimited usage
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
    tableName: 'Discounts',
    underscored: true,
    timestamps: false 
  });

  // If you want associations:
  Discount.associate = (models) => {
    // e.g. Discount.belongsTo(models.Retailer, { foreignKey: 'retailer_id' });
  };

  return Discount;
};
