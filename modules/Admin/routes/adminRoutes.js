/**
 * modules/Admin/routes/adminRoutes.js
 * 
 * Admin routes for influencer/retailer verification, admin creation, etc.
 */
const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');

// Controllers
const {
  verifyInfluencer,
  denyInfluencer,
  createAdminUser,
  verifyRetailer,
  denyRetailer
} = require('../controllers/adminController');

// Middlewares
const authenticate = require('../../Users/middleware/authenticate');
const isAdmin = require('../../Users/middleware/isAdmin');

// Rate limiter
const adminRoutesLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many admin requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false
});

router.use(adminRoutesLimiter);

/**
 * Influencer verification
 */
router.patch('/verify-influencer/:userId', authenticate, isAdmin, verifyInfluencer);
router.patch('/deny-influencer/:userId', authenticate, isAdmin, denyInfluencer);

/**
 * Create new admin user
 */
router.post('/create', authenticate, isAdmin, createAdminUser);

/**
 * Retailer verification
 */
router.patch('/verify-retailer/:retailerId', authenticate, isAdmin, verifyRetailer);
router.patch('/deny-retailer/:retailerId', authenticate, isAdmin, denyRetailer);

module.exports = router;
