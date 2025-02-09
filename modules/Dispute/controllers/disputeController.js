async function openDispute(req, res) {
    try {
      const { userId, retailerId, reason } = req.body;
      if (!userId || !retailerId || !reason) {
        return res.status(400).json({ message: 'Missing fields' });
      }
      // Create dispute in DB or mock it
      // ...
      return res.status(201).json({ message: 'Dispute opened', disputeId: 123 });
    } catch (err) {
      console.error('Error opening dispute:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
  module.exports = { openDispute };
  