/**
 * modules/Payment/routes/paymentRoutes.js
 *
 * Payment aggregator logic: monthly invoices, auto-charge, commission payouts, etc.
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
  generateInvoicesForRange,   // NEW for aggregator monthly approach
  getCommissionStatus,
  createCommission,
  payCommission
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

// Single invoice creation (manual)
router.post('/invoices', authenticate, createInvoice);
// All invoices retrieval (could be admin or retailer)
router.get('/invoices', authenticate, getInvoices);
// Pay an invoice by ID
router.patch('/invoices/:invoiceId/pay', authenticate, payInvoice);

// (NEW) Generate invoices for a given date range (monthly aggregator)
router.post('/invoices/generate-range', authenticate, generateInvoicesForRange);

// Commission endpoints
// Check user’s or influencer’s total commission
router.get('/commissions', authenticate, getCommissionStatus);

// Create a commission record manually (Test Case A)
router.post('/commissions', authenticate, createCommission);

// Pay a specific commission by ID (Test Case C)
router.patch('/commissions/:commissionId/pay', authenticate, payCommission);

module.exports = router;
