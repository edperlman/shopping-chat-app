/**
 * modules/Retailer/controllers/retailerController.js
 *
 * CHANGES:
 * 1. We define the "updateCampaign" function (line ~105).
 * 2. We export "updateCampaign" alongside createCampaign, approveCampaign, etc.
 *
 * WHY:
 * Without this function, any PATCH request would fail (404 or not defined).
 */

const { Op } = require('sequelize');
const { Retailer, User, Campaign } = require('../../../src/models');

// 1) Retailer profile creation, fetching, updating
const createRetailerProfile = async (req, res) => {
  // ...
};

const getRetailerProfile = async (req, res) => {
  // ...
};

const updateRetailerProfile = async (req, res) => {
  // ...
};

/**
 * GET /retailers?search=shoes
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
 * createCampaign - POST /retailers/campaigns
 */
const createCampaign = async (req, res) => {
  try {
    const {
      retailer_id,
      influencer_user_id,
      title,
      description,
      commission_rate
    } = req.body;

    // (Optional) Validate that the logged-in user is the same retailer_id
    // if (req.user.id !== retailer_id) {
    //   return res.status(403).json({ message: 'Not authorized' });
    // }

    const newCampaign = await Campaign.create({
      retailer_id,
      influencer_user_id,
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

// Approve or deny a campaign
const approveCampaign = async (req, res) => {
  // ...
};

const denyCampaign = async (req, res) => {
  // ...
};

/**
 * ADDED:
 * updateCampaign - PATCH /retailers/campaigns/:campaignId
 * Typical usage is to update commission_rate or other fields.
 */
const updateCampaign = async (req, res) => {
  try {
    const { campaignId } = req.params;
    // e.g., { "commission_rate": 15.0, "description": "New desc" }
    const updates = req.body;

    // Optional: confirm user role or retailer ownership
    // if (req.user.role !== 'retailer') { return res.status(403).json({ ... }); }

    // Find the campaign
    const campaign = await Campaign.findByPk(campaignId);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    // Merge allowed fields
    // You can selectively allow certain fields (like commission_rate, description):
    if (updates.commission_rate !== undefined) {
      campaign.commission_rate = updates.commission_rate;
    }
    if (updates.title !== undefined) {
      campaign.title = updates.title;
    }
    if (updates.description !== undefined) {
      campaign.description = updates.description;
    }
    // ... add more as needed

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

module.exports = {
  createRetailerProfile,
  getRetailerProfile,
  updateRetailerProfile,
  searchRetailers,
  createCampaign,
  approveCampaign,
  denyCampaign,
  updateCampaign // <-- Export new function
};
