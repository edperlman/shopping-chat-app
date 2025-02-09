/**
 * modules/Users/models/user.js
 *
 * Classic define approach for "Users" table.
 */
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: 'regular_user'
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
    tableName: 'Users',
    underscored: true,
    timestamps: false // or set true if you prefer "createdAt"/"updatedAt" columns
  });

  // If you want associations:
  User.associate = (models) => {
    // e.g. User.hasOne(models.Influencer, { foreignKey: 'user_id' });
    // e.g. User.hasOne(models.Retailer, { foreignKey: 'user_id' });
  };

  return User;
};
