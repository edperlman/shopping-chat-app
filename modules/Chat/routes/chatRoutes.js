/**
 * modules/Chat/routes/chatRoutes.js
 *
 * Defines routes for the Chat module.
 */

const express = require('express');
const router = express.Router();
const authenticate = require('../../Users/middleware/authenticate');

// Import all chat controller methods, including getRoomInfo.
const {
  createRoom,
  getRoomInfo,       // <-- Ensure this is imported
  fetchMessages,
  sendMessage,
  addParticipant
} = require('../controllers/chatController');

// Protect all routes with JWT authentication.
router.use(authenticate);

// Create a chat room (1-on-1 or group)
router.post('/rooms', createRoom);

// Get chat room info including participants
router.get('/rooms/:roomId', getRoomInfo);

// Retrieve messages from a specific chat room
router.get('/rooms/:roomId/messages', fetchMessages);

// Send a message to a chat room
router.post('/rooms/:roomId/messages', sendMessage);

// Add a participant to an existing chat room
router.post('/rooms/:roomId/participants', addParticipant);

module.exports = router;
