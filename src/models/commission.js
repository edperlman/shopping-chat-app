/**
 * src/models/commission.js
 *
 * Make sure the table has columns:
 *   id, user_id, amount, status, created_at, updated_at
 * If it doesn’t, see the migration example below.
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
    /**
     * Tells Sequelize to expect "created_at" & "updated_at" columns, not "createdAt" & "updatedAt".
     */
    timestamps: true,
    underscored: true

  });

  // optional association
  Commission.associate = function(models) {
    Commission.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
  };

  return Commission;
};
