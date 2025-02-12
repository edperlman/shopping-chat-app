/**
 * modules/Payment/routes/paymentRoutes.js
 *
 * Payment aggregator logic: monthly invoices, auto-charge, commission pay-outs, etc.
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
  getCommissionStatus,
  createCommission,        // NEW
  payCommission            // NEW
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

// (Existing) Invoices
router.post('/invoices', authenticate, createInvoice);
router.get('/invoices', authenticate, getInvoices);
router.patch('/invoices/:invoiceId/pay', authenticate, payInvoice);

// (Existing) Check user’s or influencer’s total commission
router.get('/commissions', authenticate, getCommissionStatus);

// (NEW) Create a commission record manually (Test Case A)
router.post('/commissions', authenticate, createCommission);

// (NEW) Pay a specific commission by ID (Test Case C)
router.patch('/commissions/:commissionId/pay', authenticate, payCommission);

module.exports = router;
