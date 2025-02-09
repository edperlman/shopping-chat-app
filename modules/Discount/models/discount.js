/**
 * modules/Discount/models/discount.js
 */
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
      type: DataTypes.STRING, // e.g., 'personal', 'group'
      allowNull: false
    },
    discount_percentage: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    start_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    end_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pending'
    },
    base_discount: {
      type: DataTypes.INTEGER,
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
    tableName: 'Discounts',
    underscored: true,
    timestamps: false
  });

  Discount.associate = (models) => {
    // If you have a Retailer model:
    if (models.Retailer) {
      Discount.belongsTo(models.Retailer, {
        foreignKey: 'retailer_id',
        as: 'retailer'
      });
    }

    // Comment out or remove if not using group discount
    // if (models.GroupDiscount) {
    //   Discount.hasOne(models.GroupDiscount, {
    //     foreignKey: 'discount_id',
    //     as: 'groupDiscount'
    //   });
    // }
  };

  return Discount;
};
