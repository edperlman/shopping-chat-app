/**
 * modules/Influencer/routes/influencerRoutes.js
 *
 * Updated to handle BOTH influencer verification requests
 * AND invites (POST /influencer/invites).
 */
const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');

// Import controllers
const { requestInfluencerVerification, sendInvites } = require('../controllers/influencerController');

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
 * POST /influencer
 * - If we mount at /influencer,
 *   then this is /influencer/ (like old /influencer-requests).
 *   For clarity, we'll keep it at '/', which is "request influencer verification"
 */
router.post('/', authenticate, requestInfluencerVerification);

/**
 * POST /influencer/invites
 * This route allows the influencer to invite friends/followers.
 */
router.post('/invites', authenticate, sendInvites);

module.exports = router;
