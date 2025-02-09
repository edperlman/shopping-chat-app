/**
 * modules/Retailer/controllers/retailerController.js
 *
 * Handles:
 * 1) Retailer profile creation, fetching, updating
 * 2) Searching retailers
 * 3) Basic campaign creation/approval
 */

const { Op } = require('sequelize');
// Instead of require('../models/retailer'), do this:
const { Retailer, User, Campaign } = require('../../../src/models');

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

const createCampaign = async (req, res) => {
  // ...
};

const approveCampaign = async (req, res) => {
  // ...
};

const denyCampaign = async (req, res) => {
  // ...
};

module.exports = {
  createRetailerProfile,
  getRetailerProfile,
  updateRetailerProfile,
  searchRetailers,
  createCampaign,
  approveCampaign,
  denyCampaign
};
