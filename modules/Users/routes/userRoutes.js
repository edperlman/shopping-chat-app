/**
 * modules/Users/routes/userRoutes.js
 * 
 * Defines all user-related routes. We apply rate-limiting globally.
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
  getUserById
} = require('../controllers/userController');

// Middleware
const authenticate = require('../middleware/authenticate');

// Rate limiter: e.g. max 100 requests per 15 min
const userRoutesLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many user requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false
});

// 1) Apply rate limiter
router.use(userRoutesLimiter);

// 2) Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// 3) Protected routes
router.get('/profile', authenticate, getUserProfile);
router.patch('/profile', authenticate, updateUserProfile);
router.get('/:id', authenticate, getUserById);

module.exports = router;
