const express = require('express');
const router = express.Router();
const authenticate = require('../../Users/middleware/authenticate');

const {
  createRoom,
  fetchMessages,
  sendMessage,
  addParticipant
} = require('../controllers/chatController');

// Protect all routes with authenticate for JWT auth
router.use(authenticate);

// Create a chat room (1-on-1 or group)
router.post('/rooms', createRoom);

// Get messages from a chat room
router.get('/rooms/:roomId/messages', fetchMessages);

// Send a message to a chat room
router.post('/rooms/:roomId/messages', sendMessage);

// (Optional) Add participant to existing room
router.post('/rooms/:roomId/participants', addParticipant);

module.exports = router;
