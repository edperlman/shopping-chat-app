/**
 * modules/Affiliate/routes/affiliateRoutes.js
 *
 * Updated to reflect that we handle discount-based or campaign-based affiliate links.
 */
const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');

// Import your controller
const { createAffiliateLink } = require('../controllers/affiliateController');

// If you have an authentication middleware:
const authenticate = require('../../Users/middleware/authenticate');

// Rate limiter (optional)
const affiliateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many affiliate requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false
});

router.use(affiliateLimiter);

/**
 * POST /affiliate-links
 * Create a new affiliate link.
 * Body can contain campaignId or discountId plus optional notes, commission_rate, etc.
 */
router.post('/', authenticate, createAffiliateLink);

module.exports = router;
