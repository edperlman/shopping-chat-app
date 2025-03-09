/**
 * modules/Users/middleware/authenticate.js
 *
 * Middleware to verify the user's JWT, then attach a structured user object
 * (including id, role, etc.) to `req.user`.
 */

const jwt = require('jsonwebtoken');

// IMPORTANT: import the Sequelize model from your central models index
const { User } = require('../../../src/models');

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // 1) Check the Bearer token
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // 2) Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3) Look up the user by decoded.id
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // 4) Attach a structured user object to req.user
    //    so we can do req.user.id, req.user.role in subsequent controllers
    req.user = {
      id: user.id,           // The user’s primary key
      role: user.role,       // e.g. 'admin', 'retailer', or 'regular_user'
      name: user.name,       // Optional
      email: user.email      // Optional
      // ... add additional fields if needed
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ message: 'Authentication failed' });
  }
};

module.exports = authenticate;
