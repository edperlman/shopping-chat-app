/**
 * modules/Influencer/controllers/influencerController.js
 *
 * Controller for influencer verification requests, invites, etc.
 */

const { Influencer, Campaign } = require('../../../src/models');

async function requestInfluencerVerification(req, res) {
  try {
    const { userId, socialMediaHandles, reason } = req.body;
    if (!userId) {
      return res.status(400).json({ message: 'Missing userId' });
    }

    // Check if there's an existing influencer row for this user
    let influencerRow = await Influencer.findOne({ where: { user_id: userId } });

    if (!influencerRow) {
      // Create a new row in "Influencers"
      influencerRow = await Influencer.create({
        user_id: userId,
        influencer_status: 'pending',
        verification_requested_at: new Date(),
        social_media_handle: JSON.stringify(socialMediaHandles),
        bio: reason,
        updated_at: new Date()
      });
    } else {
      // Update existing row
      influencerRow.influencer_status = 'pending';
      influencerRow.verification_requested_at = new Date();
      influencerRow.social_media_handle = JSON.stringify(socialMediaHandles);
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
 * sendInvites - handles POST /influencer/invites
 * Body example:
 * {
 *   "campaignId": 15,
 *   "emails": ["friend1@example.com", "friend2@example.com"],
 *   "message": "Check out this discount link!"
 * }
 */
async function sendInvites(req, res) {
  try {
    // If influencer is logged in, we get user id from JWT
    const userId = req.user.id;
    const { campaignId, emails, message } = req.body;

    if (!campaignId || !emails || !Array.isArray(emails)) {
      return res.status(400).json({ message: 'Missing or invalid campaignId/emails' });
    }

    // Optional: verify this user is the influencer for the given campaign
    const campaign = await Campaign.findByPk(campaignId);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }
    // if (campaign.influencer_user_id !== userId) {
    //   return res.status(403).json({ message: 'You are not authorized to invite for this campaign' });
    // }

    // In a real app, you'd email these addresses or store them in DB
    // For now, just respond with success.
    return res.status(201).json({
      message: 'Invites sent',
      campaignId,
      invitesCount: emails.length,
      details: {
        emails,
        customMessage: message
      }
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
