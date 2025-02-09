/**
 * modules/Affiliate/routes/affiliateRoutes.js
 *
 * Defines routes for affiliate link generation, maybe commission endpoints, etc.
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

// Use the limiter
router.use(affiliateLimiter);

/**
 * POST /affiliate-links
 * Create a new affiliate link
 */
router.post('/', authenticate, createAffiliateLink);

// Optionally define other endpoints if needed

module.exports = router;
