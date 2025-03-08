/**
 * modules/Influencer/controllers/influencerController.js
 *
 * Manages influencer verification requests, invites, etc.
 */
const { Influencer, Campaign } = require('../../../src/models');

async function requestInfluencerVerification(req, res) {
  try {
    const { userId, socialMediaHandles, reason } = req.body;
    if (!userId) {
      return res.status(400).json({ message: 'Missing userId' });
    }

    // Optionally check if (req.user.id === userId) or req.user.role === 'admin'
    // if (req.user.id !== userId && req.user.role !== 'admin') { ... }

    // Check if there's an existing influencer row
    let influencerRow = await Influencer.findOne({ where: { user_id: userId } });

    if (!influencerRow) {
      // Create new row
      influencerRow = await Influencer.create({
        user_id: userId,
        influencer_status: 'pending',
        verification_requested_at: new Date(),
        social_media_handle: JSON.stringify(socialMediaHandles || {}),
        bio: reason || '',
        updated_at: new Date()
      });
    } else {
      // Update existing row
      influencerRow.influencer_status = 'pending';
      influencerRow.verification_requested_at = new Date();
      influencerRow.social_media_handle = JSON.stringify(socialMediaHandles || {});
      influencerRow.bio = reason || influencerRow.bio;
      influencerRow.updated_at = new Date();
      await influencerRow.save();
    }

    return res.status(201).json({
      message: 'Influencer request submitted',
      influencer: {
        user_id: influencerRow.user_id,
        influencer_status: influencerRow.influencer_status,
        verification_requested_at: influencerRow.verification_requested_at,
        social_media_handle: influencerRow.social_media_handle,
        bio: influencerRow.bio
      }
    });
  } catch (error) {
    console.error('Error requesting influencer verification:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

/**
 * Example for invites, if needed
 */
async function sendInvites(req, res) {
  try {
    const userId = req.user.id;
    const { campaignId, emails, message } = req.body;
    if (!campaignId || !emails || !Array.isArray(emails)) {
      return res.status(400).json({ message: 'Missing or invalid campaignId/emails' });
    }
    // Possibly check if campaign belongs to userId...
    return res.status(201).json({
      message: 'Invites sent',
      campaignId,
      invitesCount: emails.length,
      details: { emails, customMessage: message }
    });
  } catch (error) {
    console.error('Error sending invites:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  requestInfluencerVerification,
  sendInvites
};
