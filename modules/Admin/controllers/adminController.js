/**
 * modules/Admin/controllers/adminController.js
 *
 * Consolidated file containing:
 *   - influencer/retailer verification
 *   - admin creation
 *   - dispute resolution (adminResolveDispute)
 */

const bcrypt = require('bcrypt');
const { User, Retailer, Influencer, Dispute } = require('../../../src/models');

/**
 * PATCH /api/admin/verify-retailer/:retailerId
 * Sets Retailer.verification_status = 'verified'
 * Also sets user.role = 'retailer'
 */
async function verifyRetailer(req, res) {
  try {
    const { retailerId } = req.params;
    const [updatedCount] = await Retailer.update(
      { verification_status: 'verified' },
      { where: { id: retailerId } }
    );
    if (!updatedCount) {
      return res.status(404).json({ message: 'Retailer not found' });
    }

    // Retrieve the retailer row
    const retailer = await Retailer.findByPk(retailerId);
    if (!retailer) {
      return res.status(404).json({ message: 'Retailer not found after update' });
    }

    // Update the user role to 'retailer'
    await User.update({ role: 'retailer' }, { where: { id: retailer.user_id } });

    res.status(200).json({ message: 'Retailer verified successfully' });
  } catch (error) {
    console.error('Error verifying retailer:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

/**
 * PATCH /api/admin/deny-retailer/:retailerId
 * Sets Retailer.verification_status = 'denied'
 * Optionally sets user.role back to 'regular_user'
 */
async function denyRetailer(req, res) {
  try {
    const { retailerId } = req.params;
    const [updatedCount] = await Retailer.update(
      { verification_status: 'denied' },
      { where: { id: retailerId } }
    );
    if (!updatedCount) {
      return res.status(404).json({ message: 'Retailer not found' });
    }

    // Retrieve row to get user_id
    const retailer = await Retailer.findByPk(retailerId);
    if (retailer) {
      // Optionally revert user
      await User.update({ role: 'regular_user' }, { where: { id: retailer.user_id } });
    }

    res.status(200).json({ message: 'Retailer request denied' });
  } catch (error) {
    console.error('Error denying retailer:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

/**
 * PATCH /api/admin/verify-influencer/:userId
 * Sets influencer_status = 'verified', user.role = 'influencer'
 */
async function verifyInfluencer(req, res) {
  try {
    const { userId } = req.params;
    const [updatedCount] = await Influencer.update(
      { influencer_status: 'verified', verification_approved_at: new Date() },
      { where: { user_id: userId } }
    );
    if (!updatedCount) {
      return res.status(404).json({ message: 'Influencer record not found' });
    }

    await User.update({ role: 'influencer' }, { where: { id: userId } });

    res.status(200).json({ message: 'Influencer verified successfully' });
  } catch (error) {
    console.error('Error verifying influencer:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

/**
 * PATCH /api/admin/deny-influencer/:userId
 * Sets influencer_status = 'denied',
 * reverts user.role to 'regular_user'
 */
async function denyInfluencer(req, res) {
  try {
    const { userId } = req.params;
    const [updatedCount] = await Influencer.update(
      { influencer_status: 'denied' },
      { where: { user_id: userId } }
    );
    if (!updatedCount) {
      return res.status(404).json({ message: 'Influencer record not found' });
    }

    await User.update({ role: 'regular_user' }, { where: { id: userId } });

    res.status(200).json({ message: 'Influencer request denied' });
  } catch (error) {
    console.error('Error denying influencer:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

/**
 * POST /api/admin/create
 * Create a new admin user
 */
async function createAdminUser(req, res) {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const adminUser = await User.create({
      name,
      email,
      password_hash: hashedPassword,
      role: 'admin'
    });

    res.status(201).json({
      message: 'Admin user created',
      user: {
        id: adminUser.id,
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role
      }
    });
  } catch (error) {
    console.error('Error creating admin user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

/**
 * PATCH /api/admin/disputes/:disputeId/resolution
 * Admin resolves a dispute.
 */
async function adminResolveDispute(req, res) {
  try {
    const { disputeId } = req.params;
    const { resolutionOutcome, notes } = req.body;

    // If you have a "Dispute" model with "id, user_id, status, reason, etc."
    const dispute = await Dispute.findByPk(disputeId);
    if (!dispute) {
      return res.status(404).json({ message: 'Dispute not found' });
    }

    // Possibly set dispute.status to the resolution outcome or store additional fields
    dispute.status = resolutionOutcome || 'resolved';
    // dispute.resolution_notes = notes; // if you have column "resolution_notes"

    await dispute.save();

    res.status(200).json({
      message: 'Dispute resolved by admin',
      dispute: {
        id: dispute.id,
        resolutionOutcome: dispute.status,
        notes: notes || null
      }
    });
  } catch (error) {
    console.error('Error resolving dispute via admin:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

/**
 * Finally, export all functions
 */
module.exports = {
  verifyRetailer,
  denyRetailer,
  verifyInfluencer,
  denyInfluencer,
  createAdminUser,
  // NEW: add this to fix "adminResolveDispute is not defined"
  adminResolveDispute
};
