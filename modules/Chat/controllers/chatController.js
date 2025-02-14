/**
 * modules/Chat/controllers/chatController.js
 *
 * Example minimal controllers for Chat.
 */
const { ChatRoom, ChatRoomParticipant, Message } = require('../../../src/models');

// Create a new 1-on-1 or group chat room
exports.createRoom = async (req, res) => {
  try {
    // body might have { roomName, participantIds: [..] }
    const { roomName, participantIds } = req.body;
    if (!participantIds || !Array.isArray(participantIds) || participantIds.length < 1) {
      return res.status(400).json({ message: 'Must provide participantIds' });
    }

    // 1) Create a new ChatRoom
    const newRoom = await ChatRoom.create({
      room_name: roomName || null
    });

    // 2) Insert ChatRoomParticipants for each user
    const participantRows = participantIds.map(pid => ({
      chat_room_id: newRoom.id,
      user_id: pid,
      role: 'member'
    }));
    await ChatRoomParticipant.bulkCreate(participantRows);

    return res.status(201).json({
      message: 'Chat room created',
      room: newRoom
    });
  } catch (error) {
    console.error('Error creating chat room:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Fetch message history in a given room
exports.fetchMessages = async (req, res) => {
  try {
    const { roomId } = req.params;

    // Check if the requesting user is a participant
    // e.g. if there's a ChatRoomParticipant row with user_id = req.user.id
    const participant = await ChatRoomParticipant.findOne({
      where: {
        chat_room_id: roomId,
        user_id: req.user.id
      }
    });
    if (!participant) {
      return res.status(403).json({ message: 'You are not in this room' });
    }

    // retrieve messages, possibly with offset/limit
    const { offset = 0, limit = 50 } = req.query;
    const messages = await Message.findAll({
      where: { chat_room_id: roomId },
      order: [['created_at', 'ASC']],
      offset: Number(offset),
      limit: Number(limit)
    });

    return res.status(200).json({ messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Send message
exports.sendMessage = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user.id; // from your authenticate JWT
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ message: 'Message content required' });
    }

    // check membership
    const participant = await ChatRoomParticipant.findOne({
      where: {
        chat_room_id: roomId,
        user_id: userId
      }
    });
    if (!participant) {
      return res.status(403).json({ message: 'You are not in this room' });
    }

    // insert message
    const newMsg = await Message.create({
      chat_room_id: roomId,
      sender_id: userId,
      content
    });

    // if you want real-time broadcast via Socket.io
    if (req.io) {
      req.io.to(`room_${roomId}`).emit('newMessage', {
        id: newMsg.id,
        sender_id: userId,
        content,
        created_at: newMsg.created_at
      });
    }

    return res.status(201).json({
      message: 'Message sent',
      data: newMsg
    });
  } catch (error) {
    console.error('Error sending message:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Example for group membership changes
exports.addParticipant = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { userIdToAdd } = req.body;
    // check if req.user is admin or has permission
    // then add userIdToAdd to ChatRoomParticipants
    const newParticipant = await ChatRoomParticipant.create({
      chat_room_id: roomId,
      user_id: userIdToAdd,
      role: 'member'
    });
    return res.status(201).json({ message: 'Participant added', data: newParticipant });
  } catch (error) {
    console.error('Error adding participant:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
