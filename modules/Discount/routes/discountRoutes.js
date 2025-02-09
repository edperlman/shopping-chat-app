/**
 * modules/Discount/routes/discountRoutes.js
 * 
 * Deals with personal discount endpoints for the MVP.
 */

const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const authenticate = require('../../Users/middleware/authenticate');

// Controllers
const {
  requestPersonalDiscount,
  approvePersonalDiscount
} = require('../controllers/discountController');

// Rate limiter
const discountLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many discount requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false
});

// Apply limiter
router.use(discountLimiter);

/**
 * Personal discount endpoints
 */
router.post('/personal-deals', authenticate, requestPersonalDiscount);
router.patch('/personal-deals/:discountId/approve', authenticate, approvePersonalDiscount);

// Group discount endpoints REMOVED for MVP

module.exports = router;
