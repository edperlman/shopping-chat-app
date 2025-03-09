/**
 * modules/Influencer/routes/influencerRoutes.js
 *
 * Defines routes for influencer requests and invites.
 */
const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const authenticate = require('../../Users/middleware/authenticate');
const {
  requestInfluencerVerification,
  sendInvites
} = require('../controllers/influencerController');

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
 * POST /influencer => request influencer verification
 * (Mount path from server.js => /influencer)
 */
router.post('/', authenticate, requestInfluencerVerification);

/**
 * POST /influencer/invites => send invites to friends/followers
 */
router.post('/invites', authenticate, sendInvites);

module.exports = router;
