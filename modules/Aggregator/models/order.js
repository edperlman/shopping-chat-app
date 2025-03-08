// modules/Aggregator/models/order.js
const { DataTypes } = require('sequelize');

/**
 * This file exports a function that expects a Sequelize instance.
 * Example usage in src/models/index.js: OrderModel(sequelize, DataTypes).
 */
module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    retailer_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    affiliate_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    discount_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    external_order_id: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    final_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    currency: {
      type: DataTypes.STRING,
      defaultValue: 'USD'
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'COMPLETED'
    }
  }, {
    tableName: 'Orders',
    underscored: true,
    timestamps: true // includes created_at, updated_at
  });

  /**
   * Optional associate function if you want to define
   * relationships here or in src/models/index.js
   */
  Order.associate = (models) => {
    // For example, if you want an association to Retailer:
    // Order.belongsTo(models.Retailer, { foreignKey: 'retailer_id' });
  };

  return Order;
};
