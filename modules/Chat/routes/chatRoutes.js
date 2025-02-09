/**
 * modules/Chat/routes/chatRoutes.js
 *
 * Basic example if you want REST for chat rooms or archived messages.
 */
const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const authenticate = require('../../Users/middleware/authenticate');

// Chat controllers
const {
  listRooms,
  createRoom,
  getRoomMessages
} = require('../controllers/chatController');

// Rate limit
const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many chat requests, try again later.',
  standardHeaders: true,
  legacyHeaders: false
});

router.use(chatLimiter);

/**
 * Example chat endpoints:
 */
router.get('/rooms', authenticate, listRooms);
router.post('/rooms', authenticate, createRoom);
router.get('/rooms/:roomId/messages', authenticate, getRoomMessages);

module.exports = router;
