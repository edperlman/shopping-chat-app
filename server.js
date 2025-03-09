/************************************
 * server.js - Basic Express Server *
 ************************************/
require('dotenv').config(); // Load .env

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');

// Import aggregator models if needed for chat
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

// *** Updated: mount influencer routes at /influencer ***
const influencerRoutes = require('./modules/Influencer/routes/influencerRoutes');

const disputeRoutes = require('./modules/Dispute/routes/disputeRoutes');
const chatRoutes = require('./modules/Chat/routes/chatRoutes');
const affiliateRoutes = require('./modules/Affiliate/routes/affiliateRoutes');
const aggregatorRoutes = require('./modules/Aggregator/routes/aggregatorRoutes');

// Mount routes
app.use('/users', userRoutes);
app.use('/retailers', retailerRoutes);
app.use('/discount', discountRoutes);
app.use('/payments', paymentRoutes);
app.use('/admin', adminRoutes);

/**
 * IMPORTANT:
 * Instead of app.use('/influencer-requests', influencerRoutes),
 * we now mount them at /influencer. So final endpoints become:
 *  - POST /influencer => requestInfluencerVerification
 *  - POST /influencer/invites => sendInvites
 */
app.use('/influencer', influencerRoutes);

app.use('/disputes', disputeRoutes);
app.use('/chat', chatRoutes);
app.use('/affiliate-links', affiliateRoutes);
app.use('/aggregator', aggregatorRoutes);

// Serve static files for testing front-end
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
 * Socket.io authentication
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
    socket.userId = decoded.id;
    socket.userRole = decoded.role;
    next();
  });
});

// Attach io instance to req for real-time broadcasting
app.use((req, res, next) => {
  req.io = io;
  next();
});

// 4) Socket.io Real-Time Chat
io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id} (User ID: ${socket.userId})`);

  // Example chat events...
  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

// 5) Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
