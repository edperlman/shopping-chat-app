/**
 * modules/Users/middleware/authenticate.js
 *
 * Middleware to verify the user's JWT, then attach the full user record
 * (including role) to `req.user`.
 */

const jwt = require('jsonwebtoken');

// IMPORTANT: import the actual Sequelize model instance
// from your central models index. Adjust the relative path if needed.
const { User } = require('../../../src/models');

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Now fetch the user by decoded.id (the real model instance)
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Attach user instance to the request
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ message: 'Authentication failed' });
  }
};

module.exports = authenticate;
