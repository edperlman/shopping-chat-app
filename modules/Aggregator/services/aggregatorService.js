/******************************************************************************
 * modules/Aggregator/services/aggregatorService.js
 *
 * Orchestrates aggregator logic: user, retailer checks, discount usage,
 * affiliate usage (via affiliateService), externalOrderId duplication, etc.
 ******************************************************************************/
const { sequelize } = require('../../../src/models');
const { DataTypes } = require('sequelize');
const defineOrder = require('../models/order');

// If user/retailer are in src/models:
const { User, Retailer } = require('../../../src/models');
const discountService = require('../../Discount/services/discountService');
const affiliateService = require('../../Affiliate/services/affiliateService');

// aggregator's local order model
const OrderModel = defineOrder(sequelize, DataTypes);

module.exports.processPurchase = async ({
  retailerId,
  userId,
  affiliateId,
  discountId,
  finalPrice,
  currency,
  externalOrderId
}) => {
  try {
    // 1) user check
    const user = await User.findByPk(userId);
    if (!user) {
      const userErr = new Error(`User with ID ${userId} not found.`);
      userErr.statusCode = 404;
      throw userErr;
    }

    // 2) retailer check
    const retailer = await Retailer.findByPk(retailerId);
    if (!retailer) {
      const retailerErr = new Error(`Retailer with ID ${retailerId} not found.`);
      retailerErr.statusCode = 404;
      throw retailerErr;
    }

    // 3) discount usage
    if (discountId) {
      await discountService.useDiscount(discountId);
    }

    // 4) affiliate usage
    if (affiliateId) {
      await affiliateService.handleAffiliateUsage(affiliateId, userId, finalPrice);
    }

    // 5) externalOrderId duplication
    if (externalOrderId) {
      const existingOrder = await OrderModel.findOne({
        where: { external_order_id: externalOrderId }
      });
      if (existingOrder) {
        const dupeErr = new Error(`Order with externalOrderId=${externalOrderId} already exists.`);
        dupeErr.statusCode = 409;
        throw dupeErr;
      }
    }

    // 6) create aggregator order
    const newOrder = await OrderModel.create({
      retailer_id: retailerId,
      user_id: userId,
      affiliate_id: affiliateId,
      discount_id: discountId,
      final_price: finalPrice,
      currency,
      external_order_id: externalOrderId
    });

    return newOrder;
  } catch (err) {
    console.error('processPurchase error:', err);
    throw err;
  }
};
