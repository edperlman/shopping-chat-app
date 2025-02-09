/**
 * modules/Discount/controllers/discountController.js
 *
 * MVP focuses on personal (one-to-one) discount requests.
 * Group discount logic is removed/commented out for now.
 */

const { Retailer, Discount } = require('../../../src/models');

/* ==================== 1. PERSONAL DISCOUNTS ==================== */

/**
 * POST /api/discounts/personal-deals
 * User requests a personal discount from a retailer
 */
async function requestPersonalDiscount(req, res) {
  try {
    const { userId, retailerId, requestedDiscount } = req.body;

    if (!userId || !retailerId) {
      return res.status(400).json({ message: 'Missing userId or retailerId' });
    }

    // Check retailer verification
    const retailer = await Retailer.findOne({ where: { id: retailerId } });
    if (!retailer) {
      return res.status(404).json({ message: 'Retailer not found' });
    }
    if (retailer.verification_status !== 'verified') {
      return res.status(403).json({
        message: `Cannot request discount: retailer is '${retailer.verification_status}'`
      });
    }

    // Create discount row => type='personal'
    const discount = await Discount.create({
      retailer_id: retailerId,
      type: 'personal',
      discount_percentage: requestedDiscount || 0,
      start_time: new Date(),
      end_time: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hrs default
      status: 'pending',
      created_at: new Date(),
      updated_at: new Date()
    });

    return res.status(201).json({
      message: 'Personal discount requested',
      discountId: discount.id,
      status: discount.status
    });
  } catch (error) {
    console.error('Error requesting personal discount:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

/**
 * PATCH /api/discounts/personal-deals/:discountId/approve
 * Retailer manually approves personal discount, optionally setting expiry
 */
async function approvePersonalDiscount(req, res) {
  try {
    const { discountId } = req.params;
    const { expiryHours } = req.body;

    const hours = (typeof expiryHours === 'number' && expiryHours > 0) ? expiryHours : 24;

    // find discount => type='personal'
    const discount = await Discount.findOne({
      where: { id: discountId, type: 'personal' }
    });
    if (!discount) {
      return res.status(404).json({
        message: 'Personal discount not found or not type=personal'
      });
    }

    discount.status = 'active';
    discount.end_time = new Date(Date.now() + hours * 60 * 60 * 1000);
    discount.updated_at = new Date();
    await discount.save();

    return res.status(200).json({
      message: 'Personal discount approved',
      discountId: discount.id,
      status: discount.status,
      end_time: discount.end_time
    });
  } catch (error) {
    console.error('Error approving personal discount:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

/* ========== EXPORTS ========== */
module.exports = {
  requestPersonalDiscount,
  approvePersonalDiscount
};
