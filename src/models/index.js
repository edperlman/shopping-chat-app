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

// Example "User" model inline
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

// Influencer model
const InfluencerModel = require('../../modules/Influencer/models/influencer');
const Influencer = InfluencerModel(sequelize, DataTypes);

// Retailer model
const RetailerModel = require('../../modules/Retailer/models/retailer');
const Retailer = RetailerModel(sequelize, DataTypes);

// Discount model
let Discount = null;
try {
  const DiscountModel = require('../../modules/Discount/models/discount');
  Discount = DiscountModel(sequelize, DataTypes);
} catch (err) {
  console.warn('No discount.js or error loading it:', err);
}

// Campaign model
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

/**
 * NEW: Load Chat Models
 */
let ChatRoom = null;
let ChatRoomParticipant = null;
let Message = null;

try {
  const ChatRoomModel = require('../../modules/Chat/models/chatRoom');
  ChatRoom = ChatRoomModel(sequelize, DataTypes);
} catch (err) {
  console.warn('No chatRoom.js or error loading it:', err);
}
try {
  const ChatRoomParticipantModel = require('../../modules/Chat/models/chatRoomParticipant');
  ChatRoomParticipant = ChatRoomParticipantModel(sequelize, DataTypes);
} catch (err) {
  console.warn('No chatRoomParticipant.js or error loading it:', err);
}
try {
  const MessageModel = require('../../modules/Chat/models/message');
  Message = MessageModel(sequelize, DataTypes);
} catch (err) {
  console.warn('No message.js or error loading it:', err);
}

/**
 * NEW: Load Aggregator Order Model
 */
let Order = null;
try {
  const OrderModel = require('../../modules/Aggregator/models/order');
  Order = OrderModel(sequelize, DataTypes);
} catch (err) {
  console.warn('No aggregator order model or error loading it:', err);
}

/**
 * NEW: Load Invoice model for Payment
 */
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

// Commission associations
if (Commission && Commission.associate) {
  Commission.associate({ User });
}

// Dispute associations
if (Dispute && Dispute.associate) {
  Dispute.associate({ Commission });
}

/**
 * Chat associations
 */
if (ChatRoom && ChatRoom.associate) {
  ChatRoom.associate({ ChatRoomParticipant, Message });
}
if (ChatRoomParticipant && ChatRoomParticipant.associate) {
  ChatRoomParticipant.associate({ ChatRoom });
}
if (Message && Message.associate) {
  Message.associate({ ChatRoom });
}

// Aggregator Order associations
if (Order && Order.associate) {
  // e.g. Order.associate({ Retailer });
}

/**
 * If Invoice needs association, do it here, e.g. linking to Retailer
 */
if (Invoice && Invoice.associate) {
  Invoice.associate({ Retailer });
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
  Invoice // <---- ADDED
};
