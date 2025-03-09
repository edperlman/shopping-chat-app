/**
 * src/models/commission.js
 *
 * Ensures that each Commission belongs to both a "User" (affiliate link owner)
 * AND optionally an "Order" (to know which order generated this commission).
 */
'use strict';

module.exports = (sequelize, DataTypes) => {
  const Commission = sequelize.define('Commission', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    order_id: {
      // Add or ensure this column exists in your DB if not present
      type: DataTypes.INTEGER,
      allowNull: true // some commissions may not be tied to a specific order
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'unpaid'
    }
  }, {
    tableName: 'Commissions',
    underscored: true,
    timestamps: true
  });

  Commission.associate = function(models) {
    // Commission belongs to a single user (the affiliate link owner)
    Commission.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });

    // Commission also belongs to an order (the purchase that generated the commission)
    Commission.belongsTo(models.Order, {
      foreignKey: 'order_id',
      as: 'order'
    });
  };

  return Commission;
};
