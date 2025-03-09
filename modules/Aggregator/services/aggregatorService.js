/******************************************************************************
 * modules/Aggregator/services/aggregatorService.js
 *
 * Orchestrates aggregator logic: user + retailer checks, discount usage,
 * affiliate usage, order creation, usage_count increment, commission creation, etc.
 ******************************************************************************/
const { sequelize } = require('../../../src/models');
const { DataTypes } = require('sequelize');
const defineOrder = require('../models/order');

// Import main models
const {
  User,
  Retailer,
  AffiliateLink,
  Commission
} = require('../../../src/models');

// If you have discount usage, import discountService:
const discountService = require('../../Discount/services/discountService');

// aggregator's local order model
const OrderModel = defineOrder(sequelize, DataTypes);

module.exports.processPurchase = async ({
  retailerId,
  userId,
  affiliateId,
  affiliateCode,
  discountId,
  finalPrice,
  currency,
  externalOrderId
}) => {
  return await sequelize.transaction(async (t) => {
    //
    // 1) Validate the user
    //
    const user = await User.findByPk(userId, { transaction: t });
    if (!user) {
      const userErr = new Error(`User with ID ${userId} not found.`);
      userErr.statusCode = 404;
      throw userErr;
    }

    //
    // 2) Validate the retailer
    //
    const retailer = await Retailer.findByPk(retailerId, { transaction: t });
    if (!retailer) {
      const retailerErr = new Error(`Retailer with ID ${retailerId} not found.`);
      retailerErr.statusCode = 404;
      throw retailerErr;
    }

    //
    // 3) Check for duplicate externalOrderId *before* awarding usage or commission
    //
    if (externalOrderId) {
      const existingOrder = await OrderModel.findOne({
        where: { external_order_id: externalOrderId },
        transaction: t
      });
      if (existingOrder) {
        const dupeErr = new Error(
          `Order with externalOrderId=${externalOrderId} already exists.`
        );
        dupeErr.statusCode = 409;
        throw dupeErr;
      }
    }

    //
    // 4) Handle discount usage if provided
    //
    if (discountId) {
      // If discountService supports transaction injection, pass { transaction: t }
      await discountService.useDiscount(discountId);
    }

    //
    // 5) Determine affiliate link from affiliateCode or affiliateId
    //
    let finalAffiliateId = affiliateId || null;
    let affLink = null;

    // If only affiliateCode is given (and not affiliateId):
    if (!finalAffiliateId && affiliateCode) {
      const codeTrimmed = affiliateCode.trim();
      if (codeTrimmed) {
        affLink = await AffiliateLink.findOne({
          where: { affiliate_code: codeTrimmed },
          transaction: t
        });
        if (affLink) {
          finalAffiliateId = affLink.id;
        } else {
          console.warn(
            `No AffiliateLink found for affiliateCode="${affiliateCode}". usage_count won't be incremented.`
          );
        }
      }
    } else if (finalAffiliateId) {
      // We have an explicit affiliateId
      affLink = await AffiliateLink.findByPk(finalAffiliateId, { transaction: t });
      if (!affLink) {
        console.warn(
          `AffiliateLink id=${finalAffiliateId} not found. usage_count won't be incremented.`
        );
      }
    }

    //
    // 6) Create aggregator order
    //
    const newOrder = await OrderModel.create(
      {
        retailer_id: retailerId,
        user_id: userId,
        affiliate_id: finalAffiliateId || null,
        discount_id: discountId || null,
        final_price: finalPrice,
        currency: currency || 'USD',
        external_order_id: externalOrderId,
        status: 'COMPLETED'
      },
      { transaction: t }
    );

    //
    // 7) If we have a valid affiliate link, increment usage_count + create Commission
    //
    if (affLink) {
      // 7.1) increment usage_count
      // ensure usage_count is not null
      const currentUsage = affLink.usage_count || 0;
      affLink.usage_count = currentUsage + 1;
      await affLink.save({ transaction: t });

      // 7.2) compute commission
      // If aggregator stores 'commission_rate=5.00' as 5%, we do rate / 100.
      // Or if 'commission_rate=0.05' => already 5%. We'll handle that logic:

      let rawRate = affLink.commission_rate;
      if (!rawRate) {
        // fallback to 5.00 as a default, or 0 => no commission
        rawRate = '5.00';
        console.warn(
          `AffiliateLink ID=${affLink.id} had null commission_rate => fallback "5.00" (5%).`
        );
      }

      let rate = parseFloat(rawRate) || 0.0;
      if (rate > 1.0) {
        // interpret e.g. "5.00" => 5% => 0.05
        rate = rate / 100.0;
      }

      const finalPriceNum = parseFloat(finalPrice) || 0.0;
      const commissionAmount = finalPriceNum * rate;

      // 7.3) Insert a row in Commissions table
      const newCommission = await Commission.create(
        {
          user_id: affLink.user_id, // The user who owns the affiliate link
          amount: commissionAmount.toFixed(2),
          status: 'unpaid',
          // Optionally store the order_id so we can track which order is paying this commission
          order_id: newOrder.id
        },
        { transaction: t }
      );
      console.log(
        `Commission created: user_id=${affLink.user_id}, amount=${commissionAmount.toFixed(
          2
        )}, order_id=${newOrder.id}. usage_count incremented.`
      );
    }

    //
    // 8) Return newly created order
    //
    return newOrder;
  });
};
