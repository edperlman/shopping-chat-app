// File: src/models/index.js
const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

// 1) Load config
const config = require(path.join(__dirname, '../../config/config.js'))['development'];
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect
  }
);

/**
 * 3) Define or import your models
 */
// Example "User" model
const User = sequelize.define('User', {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  password_hash: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, defaultValue: 'regular_user' },
  location: { type: DataTypes.STRING },
  date_of_birth: { type: DataTypes.DATE },
  preferences: { type: DataTypes.JSON }
}, {
  tableName: 'Users',
  underscored: true,
  timestamps: true // uses createdAt / updatedAt
});

// Influencer model
const InfluencerModel = require('../../modules/Influencer/models/influencer');
const Influencer = InfluencerModel(sequelize, DataTypes);

// RETAILER model
const RetailerModel = require('../../modules/Retailer/models/retailer');
const Retailer = RetailerModel(sequelize, DataTypes);

// DISCOUNT model
let Discount = null;
try {
  const DiscountModel = require('../../modules/Discount/models/discount');
  Discount = DiscountModel(sequelize, DataTypes);
} catch (err) {
  console.warn('No discount.js or error loading it. If you have a discount model, check path.');
}

// CAMPAIGN model
let Campaign = null;
try {
  const CampaignModel = require('../../modules/Retailer/models/campaign');
  Campaign = CampaignModel(sequelize, DataTypes);
} catch (err) {
  console.warn('No campaign.js or error loading it. If you have a campaign model, check path.');
}

// 4) Setup associations
if (Retailer.associate) {
  Retailer.associate({ User, Campaign, Discount });
}
if (Discount && Discount.associate) {
  Discount.associate({ Retailer, User, Campaign });
}
if (Campaign && Campaign.associate) {
  Campaign.associate({ Retailer, User, Discount });
}
if (Influencer.associate) {
  Influencer.associate({ User });
}

// 5) Export them
module.exports = {
  sequelize,
  Sequelize,
  User,
  Retailer,
  Discount,
  Influencer,
  Campaign
};
