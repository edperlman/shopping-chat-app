const express = require('express');
const router = express.Router();
const { openDispute } = require('../controllers/disputeController');
const authenticate = require('../../Users/middleware/authenticate');

router.post('/', authenticate, openDispute);

module.exports = router;
