/**
 * modules/Admin/routes/adminRoutes.js
 */
const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const authenticate = require('../../Users/middleware/authenticate');
const isAdmin = require('../../Users/middleware/isAdmin');

// Import the function
const {
  verifyInfluencer,
  denyInfluencer,
  createAdminUser,
  verifyRetailer,
  denyRetailer,
  adminResolveDispute
} = require('../controllers/adminController');

const adminRoutesLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many admin requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false
});

router.use(adminRoutesLimiter);

// influencer verifications
router.patch('/verify-influencer/:userId', authenticate, isAdmin, verifyInfluencer);
router.patch('/deny-influencer/:userId', authenticate, isAdmin, denyInfluencer);

// retailer verifications
router.patch('/verify-retailer/:retailerId', authenticate, isAdmin, verifyRetailer);
router.patch('/deny-retailer/:retailerId', authenticate, isAdmin, denyRetailer);

// admin creation
router.post('/create', authenticate, isAdmin, createAdminUser);

// dispute resolution
router.patch('/disputes/:disputeId/resolution', authenticate, isAdmin, adminResolveDispute);

module.exports = router;
