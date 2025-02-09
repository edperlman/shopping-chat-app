/************************************
 * server.js - Basic Express Server *
 ************************************/
require('dotenv').config(); // Load .env

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

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
const retailerRoutes = require('./modules/Retailer/routes/retailerRoutes'); // <== Retailer
const discountRoutes = require('./modules/Discount/routes/discountRoutes');
const paymentRoutes = require('./modules/Payment/routes/paymentRoutes');
const adminRoutes = require('./modules/Admin/routes/adminRoutes');
const influencerRoutes = require('./modules/Influencer/routes/influencerRoutes');
const disputeRoutes = require('./modules/Dispute/routes/disputeRoutes');
const chatRoutes = require('./modules/Chat/routes/chatRoutes');
const affiliateRoutes = require('./modules/Affiliate/routes/affiliateRoutes');

// Mount them on appropriate paths:
app.use('/users', userRoutes);
// CHANGE THIS to /retailers (plural):
app.use('/retailers', retailerRoutes); 

app.use('/discount', discountRoutes);
app.use('/payments', paymentRoutes);
app.use('/admin', adminRoutes);
app.use('/influencer-requests', influencerRoutes);
app.use('/disputes', disputeRoutes);
app.use('/chat', chatRoutes);
app.use('/affiliate-links', affiliateRoutes);

// 3) Create HTTP server & attach Socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// 4) Socket.io real-time chat
io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  // Example chat events:
  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);
  });

  socket.on('sendMessage', ({ roomId, content }) => {
    // Broadcast to everyone in that room
    io.to(roomId).emit('receiveMessage', {
      sender: socket.id,
      content: content
    });
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
  });
});

// 5) Start listening
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
