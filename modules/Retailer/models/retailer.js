/**
 * modules/Retailer/models/retailer.js
 */
module.exports = (sequelize, DataTypes) => {
  const Retailer = sequelize.define('Retailer', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    business_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    website: {
      type: DataTypes.STRING,
      allowNull: true
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true
    },
    verification_status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pending'
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
    tableName: 'Retailers',
    underscored: true,
    timestamps: false
  });

  Retailer.associate = (models) => {
    Retailer.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    if (models.Campaign) {
      Retailer.hasMany(models.Campaign, {
        foreignKey: 'retailer_id',
        as: 'campaigns'
      });
    }
  };

  return Retailer;
};
