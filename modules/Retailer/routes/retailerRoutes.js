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
  searchRetailers,
  updateCampaign,
  getSnippet // <-- add this import
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

// Retailer profile endpoints
router.post('/create-profile', authenticate, createRetailerProfile);
router.get('/my-profile', authenticate, getRetailerProfile);
router.patch('/update-profile', authenticate, updateRetailerProfile);

// GET /retailers?search=shoes
router.get('/', authenticate, searchRetailers);

// Basic campaigns
router.post('/campaigns', authenticate, createCampaign);
router.patch('/campaigns/:campaignId/approve', authenticate, approveCampaign);
router.patch('/campaigns/:campaignId/deny', authenticate, denyCampaign);
router.patch('/campaigns/:campaignId', authenticate, updateCampaign);

// Influencer group campaign endpoints
router.post('/campaigns/influencer-group', authenticate, createInfluencerGroupCampaign);
router.patch('/campaigns/:campaignId/approve-influencer', authenticate, approveInfluencerCampaign);
router.patch('/campaigns/:campaignId/complete', authenticate, completeInfluencerCampaign);

// ADD: snippet route
router.get('/snippet', authenticate, getSnippet);

module.exports = router;
