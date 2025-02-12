/**
 * src/models/dispute.js
 */
'use strict';

module.exports = (sequelize, DataTypes) => {
  const Dispute = sequelize.define('Dispute', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    commission_id: {
      type: DataTypes.INTEGER
    },
    retailer_id: {
      type: DataTypes.INTEGER
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'open'
    }
  }, {
    tableName: 'Disputes',
    timestamps: true,
    underscored: true // expects "created_at" & "updated_at" in the DB
  });

  // If you want associations (e.g., link to Commission or User):
  Dispute.associate = function(models) {
    // e.g. Dispute belongsTo Commission if needed
    Dispute.belongsTo(models.Commission, {
      foreignKey: 'commission_id',
      as: 'commission'
    });
    // similarly for user, retailer, etc.
  };

  return Dispute;
};
