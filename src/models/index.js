// File: src/models/index.js
'use strict';

const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

// 1) Load config
const config = require(path.join(__dirname, '../../config/config.js'))['development'];
const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect
});

/**
 * 2) Define or import your models
 */

// Users
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
  timestamps: true
});

// Influencer
const InfluencerModel = require('../../modules/Influencer/models/influencer');
const Influencer = InfluencerModel(sequelize, DataTypes);

// Retailer
const RetailerModel = require('../../modules/Retailer/models/retailer');
const Retailer = RetailerModel(sequelize, DataTypes);

// Discount
let Discount = null;
try {
  const DiscountModel = require('../../modules/Discount/models/discount');
  Discount = DiscountModel(sequelize, DataTypes);
} catch (err) {
  console.warn('No discount.js or error loading it:', err);
}

// Campaign
let Campaign = null;
try {
  const CampaignModel = require('../../modules/Retailer/models/campaign');
  Campaign = CampaignModel(sequelize, DataTypes);
} catch (err) {
  console.warn('No campaign.js or error loading it:', err);
}

/**
 * ADDED: Load AffiliateLink model
 */
let AffiliateLink = null;
try {
  const AffiliateLinkModel = require('./affiliateLink');
  AffiliateLink = AffiliateLinkModel(sequelize, DataTypes);
} catch (err) {
  console.warn('No affiliateLink.js or error loading it:', err);
}

/**
 * ADDED: Load Commission model
 */
let Commission = null;
try {
  const CommissionModel = require('./commission');
  Commission = CommissionModel(sequelize, DataTypes);
} catch (err) {
  console.warn('No commission.js or error loading it:', err);
}

/**
 * ADDED: Load Dispute model
 */
let Dispute = null;
try {
  const DisputeModel = require('./dispute');
  Dispute = DisputeModel(sequelize, DataTypes);
} catch (err) {
  console.warn('No dispute.js or error loading it:', err);
}

// Chat
let ChatRoom = null;
let ChatRoomParticipant = null;
let Message = null;
try {
  const ChatRoomModel = require('../../modules/Chat/models/chatRoom');
  ChatRoom = ChatRoomModel(sequelize, DataTypes);
} catch (err) { /* ... */ }
try {
  const ChatRoomParticipantModel = require('../../modules/Chat/models/chatRoomParticipant');
  ChatRoomParticipant = ChatRoomParticipantModel(sequelize, DataTypes);
} catch (err) { /* ... */ }
try {
  const MessageModel = require('../../modules/Chat/models/message');
  Message = MessageModel(sequelize, DataTypes);
} catch (err) { /* ... */ }

// Aggregator order
let Order = null;
try {
  const OrderModel = require('../../modules/Aggregator/models/order');
  Order = OrderModel(sequelize, DataTypes);
} catch (err) {
  console.warn('No aggregator order model or error loading it:', err);
}

// Invoice
let Invoice = null;
try {
  const InvoiceModel = require('../../modules/Payment/models/invoice');
  Invoice = InvoiceModel(sequelize, DataTypes);
} catch (err) {
  console.warn('No invoice.js or error loading it:', err);
}

/**
 * 3) Setup associations
 */

// Retailer associations
if (Retailer.associate) {
  Retailer.associate({ User, Campaign, Discount });
}

// Discount associations
if (Discount && Discount.associate) {
  Discount.associate({ Retailer, User, Campaign });
}

// Campaign associations
if (Campaign && Campaign.associate) {
  Campaign.associate({ Retailer, User, Discount });
}

// Influencer associations
if (Influencer.associate) {
  Influencer.associate({ User });
}

// AffiliateLink associations
if (AffiliateLink && AffiliateLink.associate) {
  AffiliateLink.associate({ User, Discount, Campaign });
}

// ADDED: Commission associations
if (Commission && Commission.associate) {
  // Pass references so Commission can do Commission.belongsTo(User), Commission.belongsTo(Order)
  Commission.associate({
    User,
    Order
  });
}

// Dispute associations
if (Dispute && Dispute.associate) {
  Dispute.associate({ Commission });
}

// ADDED: If Order has an associate method, call it
if (Order && Order.associate) {
  Order.associate({ Retailer });
}

// Invoice associations
if (Invoice && Invoice.associate) {
  Invoice.associate({ Retailer });
}

// Chat
if (ChatRoom && ChatRoom.associate) {
  ChatRoom.associate({ ChatRoomParticipant, Message });
}
if (ChatRoomParticipant && ChatRoomParticipant.associate) {
  ChatRoomParticipant.associate({ ChatRoom });
}
if (Message && Message.associate) {
  Message.associate({ ChatRoom });
}

/**
 * 4) Export them so other modules can import
 */
module.exports = {
  sequelize,
  Sequelize,
  User,
  Retailer,
  Discount,
  Influencer,
  Campaign,
  AffiliateLink,
  Commission,
  Dispute,
  ChatRoom,
  ChatRoomParticipant,
  Message,
  Order,
  Invoice
};
