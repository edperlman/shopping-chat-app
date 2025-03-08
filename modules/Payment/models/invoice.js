/****************************************************************************
 * modules/Payment/models/invoice.js
 * Tracks aggregator's billing to retailers (monthly, weekly, etc.)
 ****************************************************************************/
module.exports = (sequelize, DataTypes) => {
    const Invoice = sequelize.define('Invoice', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      retailer_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: 'UNPAID'  // or 'PENDING', 'PAID', etc.
      },
      period_start: {
        type: DataTypes.DATE,
        allowNull: true
      },
      period_end: {
        type: DataTypes.DATE,
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
      tableName: 'Invoices',
      underscored: true,
      timestamps: false
    });
  
    Invoice.associate = (models) => {
      // If you have a Retailer model, you can link it here
      // if (models.Retailer) {
      //   Invoice.belongsTo(models.Retailer, {
      //     foreignKey: 'retailer_id',
      //     as: 'retailer'
      //   });
      // }
    };
  
    return Invoice;
  };
  