/**
 * modules/Discount/models/groupDiscount.js
 *
 * Sequelize model definition for the "GroupDiscounts" table.
 */

module.exports = (sequelize, DataTypes) => {
  const GroupDiscount = sequelize.define('GroupDiscount', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    creator_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    retailer_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pending'
    },
    start_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    end_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    threshold_1_participants: {
      type: DataTypes.INTEGER,
      defaultValue: 5
    },
    threshold_1_discount: {
      type: DataTypes.INTEGER,
      defaultValue: 10
    },
    threshold_2_participants: {
      type: DataTypes.INTEGER,
      defaultValue: 10
    },
    threshold_2_discount: {
      type: DataTypes.INTEGER,
      defaultValue: 20
    },
    threshold_3_participants: {
      type: DataTypes.INTEGER,
      defaultValue: 25
    },
    threshold_3_discount: {
      type: DataTypes.INTEGER,
      defaultValue: 25
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    discount_id: {
      type: DataTypes.INTEGER,
      allowNull: true // Link to "Discounts".id if needed
    }
  }, {
    tableName: 'GroupDiscounts',
    underscored: true,
    timestamps: false
  });

  // Associations
  GroupDiscount.associate = (models) => {
    // Link to discount row
    GroupDiscount.belongsTo(models.Discount, {
      foreignKey: 'discount_id',
      as: 'discount'
    });
    // If you have a Retailer model
    GroupDiscount.belongsTo(models.Retailer, {
      foreignKey: 'retailer_id',
      as: 'retailer'
    });
    // or link to a User if needed: 
    // GroupDiscount.belongsTo(models.User, { foreignKey: 'creator_user_id', as: 'creatorUser' });
  };

  return GroupDiscount;
};
