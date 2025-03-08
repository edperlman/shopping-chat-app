/**
 * modules/Retailer/controllers/retailerController.js
 *
 * Handles:
 *  1) Retailer profile creation/fetching/updating
 *  2) Searching retailers
 *  3) Basic campaign creation
 *  4) Approve/deny campaign logic
 *  5) updateCampaign for partial updates
 *  6) getSnippet for aggregator snippet instructions
 */

const { Op } = require('sequelize');
const { Retailer, User, Campaign } = require('../../../src/models');

// 1) Retailer profile creation
const createRetailerProfile = async (req, res) => {
  try {
    // Example JSON body:
    // {
    //   "userId": 26,
    //   "business_name": "ShoeCorner Inc.",
    //   "website": "https://shoecorner.example.com",
    //   "location": "New York, NY"
    // }

    const { userId, business_name, website, location } = req.body;

    // Basic validation
    if (!userId || !business_name) {
      return res.status(400).json({ message: 'Missing userId or business_name' });
    }

    // (Optional) Additional role checks:
    // if (req.user.role !== 'admin' && req.user.id !== userId) {
    //   return res.status(403).json({ message: 'Not authorized to create retailer for this user' });
    // }

    // Check if retailer row already exists
    const existingRetailer = await Retailer.findOne({ where: { user_id: userId } });
    if (existingRetailer) {
      return res.status(409).json({ message: 'Retailer profile already exists for this user' });
    }

    // Create new retailer row
    const newRetailer = await Retailer.create({
      user_id: userId,
      business_name,
      website,
      location,
      verification_status: 'pending'
    });

    return res.status(201).json({
      message: 'Retailer profile created',
      retailer: {
        id: newRetailer.id,
        user_id: newRetailer.user_id,
        business_name: newRetailer.business_name,
        website: newRetailer.website,
        location: newRetailer.location,
        verification_status: newRetailer.verification_status
      }
    });
  } catch (error) {
    console.error('Error creating retailer profile:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// 2) Get Retailer Profile (placeholder if not yet implemented)
const getRetailerProfile = async (req, res) => {
  try {
    // For now, just a stub returning 501
    return res.status(501).json({ message: 'getRetailerProfile not implemented' });
  } catch (error) {
    console.error('Error fetching retailer profile:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// 3) Update Retailer Profile (placeholder if not yet implemented)
const updateRetailerProfile = async (req, res) => {
  try {
    // Another stub returning 501
    return res.status(501).json({ message: 'updateRetailerProfile not implemented' });
  } catch (error) {
    console.error('Error updating retailer profile:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * 4) GET /retailers?search=shoes
 * Search retailers by business_name
 */
const searchRetailers = async (req, res) => {
  try {
    const searchTerm = req.query.search || '';
    const matching = await Retailer.findAll({
      where: {
        business_name: {
          [Op.iLike]: `%${searchTerm}%`
        }
      }
    });

    return res.status(200).json({
      message: 'Search results',
      count: matching.length,
      data: matching
    });
  } catch (error) {
    console.error('Error searching retailers:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * 5) POST /retailers/campaigns - create a campaign
 */
const createCampaign = async (req, res) => {
  try {
    const {
      retailer_id,
      user_id,
      title,
      description,
      commission_rate
    } = req.body;

    // Possibly validate retailer ownership or user role
    const newCampaign = await Campaign.create({
      retailer_id,
      user_id,
      title,
      description,
      commission_rate
    });

    return res.status(201).json({
      message: 'Campaign created',
      campaign: newCampaign
    });
  } catch (error) {
    console.error('Error creating campaign:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * 6) PATCH /retailers/campaigns/:campaignId/approve
 */
const approveCampaign = async (req, res) => {
  try {
    const { campaignId } = req.params;

    const campaign = await Campaign.findByPk(campaignId);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    campaign.status = 'approved';
    await campaign.save();

    return res.status(200).json({
      message: 'Campaign approved successfully',
      campaign
    });
  } catch (error) {
    console.error('Error approving campaign:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * 7) PATCH /retailers/campaigns/:campaignId/deny
 */
const denyCampaign = async (req, res) => {
  try {
    const { campaignId } = req.params;

    const campaign = await Campaign.findByPk(campaignId);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    campaign.status = 'denied';
    await campaign.save();

    return res.status(200).json({
      message: 'Campaign denied',
      campaign
    });
  } catch (error) {
    console.error('Error denying campaign:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * 8) PATCH /retailers/campaigns/:campaignId
 */
const updateCampaign = async (req, res) => {
  try {
    const { campaignId } = req.params;
    const updates = req.body;

    const campaign = await Campaign.findByPk(campaignId);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    // Merge allowed fields
    if (updates.commission_rate !== undefined) {
      campaign.commission_rate = updates.commission_rate;
    }
    if (updates.title !== undefined) {
      campaign.title = updates.title;
    }
    if (updates.description !== undefined) {
      campaign.description = updates.description;
    }

    await campaign.save();

    return res.status(200).json({
      message: 'Campaign updated',
      campaign
    });
  } catch (error) {
    console.error('Error updating campaign:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * 9) GET /retailers/snippet
 * Return aggregator snippet or instructions
 */
const getSnippet = async (req, res) => {
  try {
    // Optional: verify user role = 'retailer' or 'admin'
    // if (req.user.role !== 'retailer' && req.user.role !== 'admin') {
    //   return res.status(403).json({ message: 'Not authorized to view snippet' });
    // }

    // Return simple snippet code for MVP
    return res.status(200).json({
      snippetCode: "<script src='https://your-aggregator-domain/snippet.js'></script>\n<!-- Insert after your checkout form -->",
      instructions: "Copy and paste the snippet tag into your store's checkout page to capture final price and discount usage."
    });
  } catch (error) {
    console.error('Error returning snippet code:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Final Export
module.exports = {
  createRetailerProfile,
  getRetailerProfile,
  updateRetailerProfile,
  searchRetailers,
  createCampaign,
  approveCampaign,
  denyCampaign,
  updateCampaign,
  getSnippet
};
