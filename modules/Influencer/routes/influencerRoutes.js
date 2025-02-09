/**
 * modules/Influencer/routes/influencerRoutes.js
 *
 * Defines routes for influencer requests. 
 */
const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { requestInfluencerVerification } = require('../controllers/influencerController');

// If user must be logged in:
const authenticate = require('../../Users/middleware/authenticate');

// Rate limiter
const influencerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many influencer requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false
});

// Apply limiter
router.use(influencerLimiter);

/**
 * POST /influencer-requests
 * A user requests influencer verification
 */
router.post('/', authenticate, requestInfluencerVerification);

module.exports = router;
