/**
 * modules/Retailer/routes/retailerRoutes.js
 */
const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');

const authenticate = require('../../Users/middleware/authenticate');
const {
  createRetailerProfile,
  getRetailerProfile,
  updateRetailerProfile,
  createCampaign,
  approveCampaign,
  denyCampaign,
  searchRetailers
} = require('../controllers/retailerController');

const {
  createInfluencerGroupCampaign,
  approveInfluencerCampaign,
  completeInfluencerCampaign
} = require('../controllers/campaignController');

const retailerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many retailer requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false
});

router.use(retailerLimiter);

// Retailer profile
router.post('/create-profile', authenticate, createRetailerProfile);
router.get('/my-profile', authenticate, getRetailerProfile);
router.patch('/update-profile', authenticate, updateRetailerProfile);

// Retailer search => GET /retailers?search=shoes
router.get('/', authenticate, searchRetailers);

// Basic campaigns
router.post('/campaigns', authenticate, createCampaign);
router.patch('/campaigns/:campaignId/approve', authenticate, approveCampaign);
router.patch('/campaigns/:campaignId/deny', authenticate, denyCampaign);

// influencer group campaign
router.post('/campaigns/influencer-group', authenticate, createInfluencerGroupCampaign);
router.patch('/campaigns/:campaignId/approve-influencer', authenticate, approveInfluencerCampaign);
router.patch('/campaigns/:campaignId/complete', authenticate, completeInfluencerCampaign);

module.exports = router;
