/**
 * modules/Admin/controllers/adminController.js
 */

const bcrypt = require('bcrypt');

// Replace old references to "../../Influencers/models/influencer"
// and "../../Users/models/user" with a single import from your shared models index.
// Example: const { User, Retailer, Influencer } = require('../../../src/models');
const { User, Retailer, Influencer } = require('../../../src/models');

/**
 * PATCH /api/admin/verify-retailer/:retailerId
 * Sets Retailer.verification_status = 'verified'
 * Also sets the associated user's role = 'retailer'
 */
const verifyRetailer = async (req, res) => {
  try {
    const { retailerId } = req.params;
    // 1) Update retailer verification status
    const [updatedCount] = await Retailer.update(
      { verification_status: 'verified' },
      { where: { id: retailerId } }
    );
    if (!updatedCount) {
      return res.status(404).json({ message: 'Retailer not found' });
    }

    // 2) Retrieve the retailer row to get user_id
    const retailer = await Retailer.findByPk(retailerId);
    if (!retailer) {
      return res.status(404).json({ message: 'Retailer not found after update' });
    }

    // 3) Update the user role to 'retailer'
    await User.update({ role: 'retailer' }, { where: { id: retailer.user_id } });

    res.status(200).json({ message: 'Retailer verified successfully' });
  } catch (error) {
    console.error('Error verifying retailer:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * PATCH /api/admin/deny-retailer/:retailerId
 * Sets Retailer.verification_status = 'denied'
 * Also reverts the associated user's role to 'regular_user' (if desired)
 */
const denyRetailer = async (req, res) => {
  try {
    const { retailerId } = req.params;
    const [updatedCount] = await Retailer.update(
      { verification_status: 'denied' },
      { where: { id: retailerId } }
    );
    if (!updatedCount) {
      return res.status(404).json({ message: 'Retailer not found' });
    }

    // Retrieve the retailer row to find user_id
    const retailer = await Retailer.findByPk(retailerId);
    if (retailer) {
      // Optionally revert user to 'regular_user' or another role
      await User.update({ role: 'regular_user' }, { where: { id: retailer.user_id } });
    }

    res.status(200).json({ message: 'Retailer request denied' });
  } catch (error) {
    console.error('Error denying retailer:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * PATCH /api/admin/verify-influencer/:userId
 * Sets influencer_status = 'verified' in the Influencer table
 * Also sets user.role = 'influencer'
 */
const verifyInfluencer = async (req, res) => {
  try {
    const { userId } = req.params;
    const [updatedCount] = await Influencer.update(
      { influencer_status: 'verified', verification_approved_at: new Date() },
      { where: { user_id: userId } }
    );
    if (!updatedCount) {
      return res.status(404).json({ message: 'Influencer record not found' });
    }

    // Also set user role to 'influencer'
    await User.update({ role: 'influencer' }, { where: { id: userId } });

    res.status(200).json({ message: 'Influencer verified successfully' });
  } catch (error) {
    console.error('Error verifying influencer:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * PATCH /api/admin/deny-influencer/:userId
 * Sets influencer_status = 'denied'
 * Optionally sets user.role back to 'regular_user'
 */
const denyInfluencer = async (req, res) => {
  try {
    const { userId } = req.params;
    const [updatedCount] = await Influencer.update(
      { influencer_status: 'denied' },
      { where: { user_id: userId } }
    );
    if (!updatedCount) {
      return res.status(404).json({ message: 'Influencer record not found' });
    }

    // Optionally set user role back to 'regular_user'
    await User.update({ role: 'regular_user' }, { where: { id: userId } });

    res.status(200).json({ message: 'Influencer request denied' });
  } catch (error) {
    console.error('Error denying influencer:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * POST /api/admin/create
 * Create a new admin user. 
 * Only existing admin can do this.
 */
const createAdminUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const adminUser = await User.create({
      name,
      email,
      password_hash: hashedPassword,
      role: 'admin',
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
};

module.exports = {
  verifyInfluencer,
  denyInfluencer,
  createAdminUser,
  verifyRetailer,
  denyRetailer,
};
