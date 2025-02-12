/**
 * modules/Affiliate/controllers/affiliateController.js
 *
 * Updated to handle BOTH:
 * 1) Regular user discount links (discountId)
 * 2) Influencer campaign links (campaignId)
 */

const { Campaign, Discount, AffiliateLink } = require('../../../src/models'); 
// Note: "AffiliateLink" is the new model referencing your "AffiliateLinks" table
// Adjust imports if your index.js exports these models differently

async function createAffiliateLink(req, res) {
  try {
    // The user is already authenticated; get the userId from JWT
    const userId = req.user.id;
    // We handle either discountId or campaignId from the request body
    const { discountId, campaignId, notes } = req.body;

    // Quick validation
    if (!discountId && !campaignId) {
      return res.status(400).json({ message: 'Provide either discountId or campaignId' });
    }

    // If discountId is present => normal user scenario
    if (discountId) {
      // Optional: verify the discount exists
      const discount = await Discount.findByPk(discountId);
      if (!discount) {
        return res.status(404).json({ message: 'Discount not found' });
      }
      // Potentially check discount.status === 'active' or other logic
    }

    // If campaignId is present => influencer scenario
    if (campaignId) {
      // Optional: verify the campaign exists
      const campaign = await Campaign.findByPk(campaignId);
      if (!campaign) {
        return res.status(404).json({ message: 'Campaign not found' });
      }
      // Optionally check if the user matches campaign.influencer_user_id or user is indeed an influencer
    }

    // Generate an affiliate code (random approach, or custom)
    const affiliateCode = `AFF-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    // Create the record in DB
    const newLink = await AffiliateLink.create({
      user_id: userId,
      discount_id: discountId || null,
      campaign_id: campaignId || null,
      affiliate_code: affiliateCode,
      notes: notes || null
    });

    // Build the link for the aggregator snippet (adjust domain as needed)
    const affiliateLinkUrl = `http://yourdomain.com?aff=${affiliateCode}`;

    return res.status(201).json({
      message: 'Affiliate link generated',
      affiliateLinkUrl,
      userId,
      discountId: discountId || null,
      campaignId: campaignId || null,
      notes: notes || null
    });
  } catch (error) {
    console.error('Error generating affiliate link:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  createAffiliateLink
};
