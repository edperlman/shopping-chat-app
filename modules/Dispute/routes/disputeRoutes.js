/**
 * modules/Dispute/routes/disputeRoutes.js
 */
const express = require('express');
const router = express.Router();
const authenticate = require('../../Users/middleware/authenticate');
const { createDispute, updateDispute } = require('../controllers/disputeController');

router.post('/', authenticate, createDispute);           // Create a new dispute
router.patch('/:disputeId', authenticate, updateDispute); // e.g. handle or resolve the dispute

module.exports = router;
