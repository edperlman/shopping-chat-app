/**
 * modules/Retailer/routes/retailerRoutes.js
 
 */

const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');

// Middleware for JWT-based authentication
const authenticate = require('../../Users/middleware/authenticate');

// Import relevant controller functions
const {
  createRetailerProfile,
  getRetailerProfile,
  updateRetailerProfile,
  createCampaign,
  approveCampaign,
  denyCampaign,
  searchRetailers,
  updateCampaign // <-- ADDED import for the new function
} = require('../controllers/retailerController');

const {
  createInfluencerGroupCampaign,
  approveInfluencerCampaign,
  completeInfluencerCampaign
} = require('../controllers/campaignController');

// Apply rate-limiting to all retailer endpoints
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

// Retailer search => GET /retailers?search=shoes
router.get('/', authenticate, searchRetailers);

/**
 * Basic campaigns
 * POST /retailers/campaigns => createCampaign
 */
router.post('/campaigns', authenticate, createCampaign);

// Approve or deny existing campaign
router.patch('/campaigns/:campaignId/approve', authenticate, approveCampaign);
router.patch('/campaigns/:campaignId/deny', authenticate, denyCampaign);

/**
 * ADDED: Generic update route
 * PATCH /retailers/campaigns/:campaignId => updateCampaign
 */
router.patch('/campaigns/:campaignId', authenticate, updateCampaign);

// Influencer group campaign endpoints
router.post('/campaigns/influencer-group', authenticate, createInfluencerGroupCampaign);
router.patch('/campaigns/:campaignId/approve-influencer', authenticate, approveInfluencerCampaign);
router.patch('/campaigns/:campaignId/complete', authenticate, completeInfluencerCampaign);

module.exports = router;
