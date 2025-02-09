/**
 * modules/Influencer/controllers/influencerController.js
 *
 * Controller for influencer verification requests, updates, etc.
 */

const { Influencer } = require('../../../src/models');

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

module.exports = {
  requestInfluencerVerification
};
