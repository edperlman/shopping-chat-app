/**
 * modules/Influencer/routes/influencerRoutes.js
 *
 * Manages influencer requests, invites, etc.
 */
const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');

// Controllers
const {
  requestInfluencerVerification,
  sendInvites
} = require('../controllers/influencerController');

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
 * POST /influencer-requests => handled by server mount
 * So this route is '/', meaning /influencer-requests => router.post('/')
 */
router.post('/', authenticate, requestInfluencerVerification);

/**
 * POST /influencer-requests/invites => (optional)
 * or if you prefer /influencer/invites, you'd mount differently in server.js
 */
router.post('/invites', authenticate, sendInvites);

module.exports = router;
