/******************************************************************************
 * modules/Aggregator/routes/aggregatorRoutes.js
 ******************************************************************************/
const express = require('express');
const router = express.Router();

// aggregatorController is in ../controllers
const aggregatorController = require('../controllers/aggregatorController');

// POST /aggregator/track-purchase => store final sale in DB
router.post('/track-purchase', aggregatorController.trackPurchase);

// GET /aggregator/snippet => serve snippet file
router.get('/snippet', aggregatorController.serveSnippet);

module.exports = router;
