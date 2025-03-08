/**
 * modules/Users/routes/userRoutes.js
 */
const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');

// Controllers
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getUserById,
  signupUser
} = require('../controllers/userController');

// Middleware
const authenticate = require('../middleware/authenticate');

// Rate limiter
const userRoutesLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many user requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false
});

// Apply rate limiter
router.use(userRoutesLimiter);

// Public routes
router.post('/register', registerUser);
router.post('/signup', signupUser);   
router.post('/login', loginUser);   // <--- Login route

// Protected routes
router.get('/profile', authenticate, getUserProfile);
router.patch('/profile', authenticate, updateUserProfile);
router.get('/:id', authenticate, getUserById);

module.exports = router;
