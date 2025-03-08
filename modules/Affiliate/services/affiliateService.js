/****************************************************************************
 * modules/Affiliate/services/affiliateService.js
 *
 * Manages affiliate link usage, status checks, usage_count increments, etc.
 * NO references to aggregator's 'order.js'.
 ****************************************************************************/
const { sequelize } = require('../../../src/models');
const { DataTypes } = require('sequelize');
const defineAffiliateLink = require('../models/affiliateLink');

const AffiliateLink = defineAffiliateLink(sequelize, DataTypes);

module.exports.handleAffiliateUsage = async (affiliateId, userId, finalPrice) => {
  try {
    // 1) Validate the affiliate link by ID
    const affLink = await AffiliateLink.findByPk(affiliateId);
    if (!affLink) {
      const notFoundError = new Error(`Affiliate link with ID ${affiliateId} not found.`);
      notFoundError.statusCode = 404;
      throw notFoundError;
    }

    // 2) Check if link is 'ACTIVE'
    if (affLink.status !== 'ACTIVE') {
      // e.g. if link is 'INACTIVE' or 'EXPIRED' or something else
      const statusError = new Error(`Affiliate link ${affiliateId} is not active (status=${affLink.status}).`);
      statusError.statusCode = 400;
      throw statusError;
    }

    // 3) usage_count increment
    affLink.usage_count += 1;
    await affLink.save();

    // 4) Commission logic if desired
    // e.g. let commissionAmount = finalPrice * parseFloat(affLink.commission_rate);
    // But we do not store aggregator orders here.

    return {
      success: true,
      message: `Affiliate usage handled for link ${affiliateId}`,
      usage_count: affLink.usage_count,
      status: affLink.status
    };
  } catch (err) {
    console.error('handleAffiliateUsage error:', err);
    throw err;
  }
};
