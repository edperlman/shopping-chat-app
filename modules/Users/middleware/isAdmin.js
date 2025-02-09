/**
 * modules\Users\middleware\isAdmin.js
 *
 * Checks if the user is an admin. Assumes `authenticate` was already used
 * so that `req.user` is populated.
 */
module.exports = function isAdmin(req, res, next) {
    // If req.user is missing, that means no valid user was attached
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
  
    // Check user role
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: Admins only' });
    }
  
    // Passed both checks!
    next();
  };
  