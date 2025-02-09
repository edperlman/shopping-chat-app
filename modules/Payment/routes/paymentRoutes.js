/**
 * modules/Payment/routes/paymentRoutes.js
 * 
 * Payment aggregator logic: monthly invoice, auto-charge, commission pay-outs, etc.
 */
const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const authenticate = require('../../Users/middleware/authenticate');

// Payment controllers
const {
  createInvoice,
  getInvoices,
  payInvoice,
  getCommissionStatus
} = require('../controllers/paymentController');

// Rate limiter
const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many payment requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false
});

router.use(paymentLimiter);

/**
 * Payment aggregator endpoints
 */
router.post('/invoices', authenticate, createInvoice);          // Retailer creates monthly invoice?
router.get('/invoices', authenticate, getInvoices);             // Admin or retailer can view 
router.patch('/invoices/:invoiceId/pay', authenticate, payInvoice); // Pay aggregator invoice
router.get('/commissions', authenticate, getCommissionStatus);  // Check user’s or influencer’s commission

module.exports = router;
