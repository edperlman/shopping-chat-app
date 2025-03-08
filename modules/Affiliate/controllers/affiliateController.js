/******************************************************************************
 * modules/Affiliate/controllers/affiliateController.js
 *
 * Allows user to create affiliate links with a custom commission_rate.
 * Fix: We now read userId from req.user.id (JWT token) instead of hardcoding 23.
 ******************************************************************************/
const { sequelize } = require('../../../src/models');
const { DataTypes } = require('sequelize');
const defineAffiliateLink = require('../models/affiliateLink');
const crypto = require('crypto');

// Load the affiliateLink model
const AffiliateLink = defineAffiliateLink(sequelize, DataTypes);

exports.createAffiliateLink = async (req, res) => {
  try {
    // Get user ID from the JWT token (set by authenticate middleware)
    const userId = req.user.id;
    if (!userId) {
      return res.status(401).json({ message: 'Not authenticated or user ID missing' });
    }

    const { campaignId, discountId, notes } = req.body;

    // parse commission_rate input
    let commissionRateInput = req.body.commission_rate;
    let finalCommissionRate = 0.10;
    if (commissionRateInput !== undefined && commissionRateInput !== null) {
      const parsed = parseFloat(commissionRateInput);
      if (!isNaN(parsed) && parsed > 0) {
        finalCommissionRate = parsed;
      }
    }

    // Generate a random affiliate code, e.g. AFF-XXXX
    const randomSuffix = crypto.randomBytes(2).toString('hex').toUpperCase();
    const randomCode = `AFF-${randomSuffix}`;

    // Insert new affiliate link
    const newLink = await AffiliateLink.create({
      user_id: userId,                    // FIX: use the real user ID from the token
      campaign_id: campaignId || null,
      discount_id: discountId || null,
      affiliate_code: randomCode,
      notes: notes || null,
      commission_rate: finalCommissionRate,
      status: 'ACTIVE',
      usage_count: 0
    });

    // Construct an example affiliate link URL
    const affiliateLinkUrl = `http://yourdomain.com?aff=${newLink.affiliate_code}`;

    return res.status(201).json({
      message: 'Affiliate link generated',
      affiliateLinkUrl,
      userId: newLink.user_id,
      discountId: newLink.discount_id,
      campaignId: newLink.campaign_id,
      notes: newLink.notes,
      commission_rate: String(newLink.commission_rate)
    });
  } catch (error) {
    console.error('Error creating affiliate link:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
