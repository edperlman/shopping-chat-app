/**
 * modules/Dispute/controllers/disputeController.js
 */
const { Dispute } = require('../../../src/models');

async function createDispute(req, res) {
  try {
    // e.g. { "commissionId": 10, "retailerId": 5, "reason": "Commission not paid" }
    const userId = req.user.id;
    const { commissionId, retailerId, reason } = req.body;

    if (!reason) {
      return res.status(400).json({ message: 'Dispute reason is required' });
    }

    const newDispute = await Dispute.create({
      user_id: userId,
      commission_id: commissionId || null,
      retailer_id: retailerId || null,
      reason: reason,
      status: 'open'
    });

    return res.status(201).json({
      message: 'Dispute created',
      dispute: newDispute
    });
  } catch (error) {
    console.error('Error creating dispute:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function updateDispute(req, res) {
  try {
    const { disputeId } = req.params;
    // e.g. { "status": "resolved", "resolutionNote": "Paid partial refund" }
    const { status } = req.body;

    const dispute = await Dispute.findByPk(disputeId);
    if (!dispute) {
      return res.status(404).json({ message: 'Dispute not found' });
    }

    if (status) {
      dispute.status = status;
    }
    // If you want to store resolution notes, you can add "resolution_note" column in table
    // dispute.resolution_note = resolutionNote || dispute.resolution_note

    await dispute.save();

    return res.status(200).json({
      message: 'Dispute updated',
      dispute
    });
  } catch (error) {
    console.error('Error updating dispute:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  createDispute,
  updateDispute
};
