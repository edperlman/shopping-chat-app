/************************************
 * server.js - Basic Express Server *
 ************************************/
require('dotenv').config(); // Load .env

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken'); // For verifying JWT tokens

// Import aggregator models
const { ChatRoom, ChatRoomParticipant, Message, User } = require('./src/models');

const app = express();
app.use(cors());
app.use(express.json());

// 1) Basic route to test server
app.get('/', (req, res) => {
  res.send('Welcome to shopping-chat-app aggregator server!');
});

/************************************************
 * 2) Integrate your aggregator modules’ routes *
 ************************************************/
const userRoutes = require('./modules/Users/routes/userRoutes');
const retailerRoutes = require('./modules/Retailer/routes/retailerRoutes');
const discountRoutes = require('./modules/Discount/routes/discountRoutes');
const paymentRoutes = require('./modules/Payment/routes/paymentRoutes');
const adminRoutes = require('./modules/Admin/routes/adminRoutes');
const influencerRoutes = require('./modules/Influencer/routes/influencerRoutes');
const disputeRoutes = require('./modules/Dispute/routes/disputeRoutes');
const chatRoutes = require('./modules/Chat/routes/chatRoutes');
const affiliateRoutes = require('./modules/Affiliate/routes/affiliateRoutes');

// Mount routes
app.use('/users', userRoutes);
app.use('/retailers', retailerRoutes);
app.use('/discount', discountRoutes);
app.use('/payments', paymentRoutes);
app.use('/admin', adminRoutes);
app.use('/influencer', influencerRoutes);
app.use('/disputes', disputeRoutes);
app.use('/chat', chatRoutes);
app.use('/affiliate-links', affiliateRoutes);

// Serve static files for testing front-end (if needed)
app.use(express.static(path.join(__dirname, 'test-frontend')));

// 3) Create HTTP server & attach Socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

/**
 * Socket.io Authentication Middleware:
 * Verify the JWT token passed in handshake.auth.token.
 * On success, attach decoded user id (and role, if needed) to socket.userId.
 */
io.use((socket, next) => {
  const token = socket.handshake.auth && socket.handshake.auth.token;
  if (!token) {
    console.error('Socket connection rejected: No token provided.');
    return next(new Error('Authentication error: No token provided'));
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error('Socket connection rejected: Invalid token.', err);
      return next(new Error('Authentication error: Invalid token'));
    }
    // Attach real user id from the token payload to socket object.
    socket.userId = decoded.id;
    socket.userRole = decoded.role; // if needed for further checks
    next();
  });
});

/**
 * MIDDLEWARE: Attach io instance to req so controllers can broadcast events
 */
app.use((req, res, next) => {
  req.io = io;
  next();
});

/**
 * 4) Socket.io Real-Time Chat with Real-World User ID Handling
 */
io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id} (User ID: ${socket.userId})`);

  // Event: joinRoom
  socket.on('joinRoom', async (roomId) => {
    try {
      // If ChatRoom model doesn't exist, handle ephemeral
      if (!ChatRoom) {
        socket.join(`room_${roomId}`);
        console.log(`(Ephemeral) Socket ${socket.id} joined room_${roomId}`);
        return;
      }
      // Check if the ChatRoom exists
      const room = await ChatRoom.findByPk(roomId);
      if (!room) {
        socket.emit('joinError', { message: 'Room does not exist' });
        return;
      }
      // (Optional) Check if the user is a participant of this room
      if (ChatRoomParticipant) {
        const participant = await ChatRoomParticipant.findOne({
          where: {
            chat_room_id: roomId,
            user_id: socket.userId
          }
        });
        if (!participant) {
          socket.emit('joinError', { message: 'You are not a participant of this room' });
          return;
        }
      }
      // Valid join
      const broadcastRoom = `room_${roomId}`;
      socket.join(broadcastRoom);
      console.log(`Socket ${socket.id} (User ID: ${socket.userId}) joined ${broadcastRoom}`);
      socket.emit('joinSuccess', { roomId });
    } catch (err) {
      console.error('joinRoom error:', err);
      socket.emit('joinError', { message: 'Internal server error' });
    }
  });

  // Event: sendMessage
  socket.on('sendMessage', async ({ roomId, content }) => {
    try {
      // If no real model, just broadcast ephemeral
      if (!Message) {
        const broadcastRoom = `room_${roomId}`;
        io.to(broadcastRoom).emit('receiveMessage', {
          sender_id: socket.userId,
          content
        });
        return;
      }

      // Check if the user is allowed to send messages in this room
      if (ChatRoomParticipant) {
        const participant = await ChatRoomParticipant.findOne({
          where: {
            chat_room_id: roomId,
            user_id: socket.userId
          }
        });
        if (!participant) {
          socket.emit('messageError', { message: 'You are not in this room' });
          return;
        }
      }

      // Insert the message in DB with the real user ID
      const newMsg = await Message.create({
        chat_room_id: roomId,
        sender_id: socket.userId,
        content
      });

      // Broadcast to all in that room
      const broadcastRoom = `room_${roomId}`;
      io.to(broadcastRoom).emit('receiveMessage', {
        id: newMsg.id,
        sender_id: newMsg.sender_id,
        content: newMsg.content,
        created_at: newMsg.created_at
      });

      console.log(`Message inserted in room ${roomId} by User ${socket.userId}: "${content}"`);
    } catch (err) {
      console.error('sendMessage error:', err);
      socket.emit('messageError', { message: 'Internal server error' });
    }
  });

  // Event: typing (ephemeral)
  socket.on('typing', ({ roomId, isTyping }) => {
    // Log ephemeral typing for debug
    console.log(`User ${socket.userId} is typing in room ${roomId}: ${isTyping}`);
    const broadcastRoom = `room_${roomId}`;
    io.to(broadcastRoom).emit('userTyping', {
      userId: socket.userId,
      isTyping
    });
  });

  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

// 5) Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
