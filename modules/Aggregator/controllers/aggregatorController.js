/******************************************************************************
 * modules/Aggregator/controllers/aggregatorController.js
 ******************************************************************************/
const path = require('path');
const aggregatorService = require('../services/aggregatorService');

exports.trackPurchase = async (req, res) => {
  try {
    const {
      retailerId,
      userId,
      affiliateId,
      affiliateCode,
      discountId,
      finalPrice,
      currency,
      externalOrderId
    } = req.body;

    // Main logic in aggregatorService
    const newOrder = await aggregatorService.processPurchase({
      retailerId,
      userId,
      affiliateId,
      affiliateCode,
      discountId,
      finalPrice,
      currency,
      externalOrderId
    });

    return res.status(201).json({
      success: true,
      order: newOrder
    });
  } catch (error) {
    console.error('trackPurchase error:', error);

    let statusCode = 500;
    let message = 'Internal server error';

    if (error.statusCode) {
      statusCode = error.statusCode;
      message = error.message;
    } else if (error.message && error.message.includes('not found')) {
      statusCode = 404;
      message = error.message;
    } else if (error.message && error.message.includes('already exists')) {
      statusCode = 409;
      message = error.message;
    }

    return res.status(statusCode).json({
      success: false,
      message
    });
  }
};

/**
 * Serve aggregator snippet
 */
exports.serveSnippet = (req, res) => {
  const snippetPath = path.join(__dirname, '../snippet', 'snippet.js');
  res.sendFile(snippetPath);
};
