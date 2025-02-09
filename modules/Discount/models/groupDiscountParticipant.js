/**
 * modules/Discount/models/groupDiscountParticipant.js
 *
 * Defines the "GroupDiscountParticipants" table in Sequelize.
 */
module.exports = (sequelize, DataTypes) => {
    const GroupDiscountParticipant = sequelize.define('GroupDiscountParticipant', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      group_discount_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      joined_at: {
        type: DataTypes.DATE,
        allowNull: false
      }
    }, {
      tableName: 'GroupDiscountParticipants', // matches your actual DB table
      underscored: true,   // if you're using created_at / updated_at columns
      timestamps: false    // or true if you do want Sequelize-managed timestamps
    });
  
    // Optional: set up associations if needed
    GroupDiscountParticipant.associate = (models) => {
      // e.g. GroupDiscountParticipant.belongsTo(models.GroupDiscount, { foreignKey: 'group_discount_id' });
      // e.g. GroupDiscountParticipant.belongsTo(models.User, { foreignKey: 'user_id' });
    };
  
    return GroupDiscountParticipant;
  };
  