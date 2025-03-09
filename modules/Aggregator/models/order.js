const { DataTypes } = require('sequelize');

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
    timestamps: true
  });

  Order.associate = (models) => {
    // Order belongs to a retailer
    Order.belongsTo(models.Retailer, {
      foreignKey: 'retailer_id',
      as: 'retailer'
    });
  };

  return Order;
};
