/**
 * modules/Chat/controllers/chatController.js
 *
 * Handles creating chat rooms (1-on-1 or group), fetching message history,
 * sending messages, adding participants, and (newly) fetching room info (C6 fix).
 */

const { ChatRoom, ChatRoomParticipant, Message } = require('../../../src/models');

/**
 * POST /chat/rooms
 * Creates a new chat (1-on-1 or group).
 * Body example:
 * {
 *   "isGroup": false,
 *   "participants": [ 5 ],
 *   "title": "My 1-on-1 Chat"
 * }
 */
exports.createRoom = async (req, res) => {
  try {
    const { title, participants, isGroup } = req.body;

    // Validate participants array
    if (!Array.isArray(participants) || participants.length < 1) {
      return res.status(400).json({ message: 'Must provide participants (non-empty array of user IDs)' });
    }

    // Merge in the requesting user => ensures the creator is always a participant
    const creatorId = req.user.id;
    const uniqueParticipantSet = new Set([...participants, creatorId]);
    const finalParticipantIds = [...uniqueParticipantSet];

    // Create the ChatRoom record
    // Assuming ChatRoom has columns like: room_name, is_group, created_at, updated_at, etc.
    const newRoom = await ChatRoom.create({
      room_name: title || null,
      is_group: Boolean(isGroup)
    });

    // Bulk insert ChatRoomParticipant
    const participantRows = finalParticipantIds.map((userId) => ({
      chat_room_id: newRoom.id,
      user_id: userId,
      role: userId === creatorId ? 'owner' : 'member'
    }));
    await ChatRoomParticipant.bulkCreate(participantRows);

    return res.status(201).json({
      message: isGroup ? 'Group chat created' : '1-on-1 chat created',
      room: {
        id: newRoom.id,
        isGroup: !!isGroup,
        title: newRoom.room_name,
        participants: finalParticipantIds
      }
    });
  } catch (error) {
    console.error('Error creating chat room:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * GET /chat/rooms/:roomId/messages
 * Retrieves messages for a specific room, ensuring the requester is a participant.
 * Query params: ?offset=0&limit=50
 */
exports.fetchMessages = async (req, res) => {
  try {
    const { roomId } = req.params;
    const participant = await ChatRoomParticipant.findOne({
      where: { chat_room_id: roomId, user_id: req.user.id }
    });
    if (!participant) {
      return res.status(403).json({ message: 'You are not in this room' });
    }

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

/**
 * POST /chat/rooms/:roomId/messages
 * Sends a message if the user is a participant.
 */
exports.sendMessage = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user.id;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: 'Message content required' });
    }

    // Check membership
    const participant = await ChatRoomParticipant.findOne({
      where: { chat_room_id: roomId, user_id: userId }
    });
    if (!participant) {
      return res.status(403).json({ message: 'You are not in this room' });
    }

    const newMsg = await Message.create({
      chat_room_id: roomId,
      sender_id: userId,
      content
    });

    // Optional real-time broadcast
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

/**
 * POST /chat/rooms/:roomId/participants
 * Add a user to a group chat, if the request user is allowed.
 */
exports.addParticipant = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { userIdToAdd } = req.body;

    if (!userIdToAdd) {
      return res.status(400).json({ message: 'Missing userIdToAdd' });
    }

    // Check if the request user is in this room
    const participant = await ChatRoomParticipant.findOne({
      where: { chat_room_id: roomId, user_id: req.user.id }
    });
    if (!participant) {
      return res.status(403).json({ message: 'You are not in this room or not allowed' });
    }

    // Insert new participant row
    const newParticipant = await ChatRoomParticipant.create({
      chat_room_id: roomId,
      user_id: userIdToAdd,
      role: 'member'
    });

    return res.status(201).json({
      message: 'Participant added',
      data: newParticipant
    });
  } catch (error) {
    console.error('Error adding participant:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * GET /chat/rooms/:roomId
 * Return chat room info (including participants) for the user if they are in the room.
 */
exports.getRoomInfo = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user.id;

    // 1) Confirm the requesting user is in ChatRoomParticipant
    const participant = await ChatRoomParticipant.findOne({
      where: {
        chat_room_id: roomId,
        user_id: userId
      }
    });
    if (!participant) {
      return res.status(403).json({ message: 'You are not in this room' });
    }

    // 2) Fetch the ChatRoom record
    const room = await ChatRoom.findByPk(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Chat room not found' });
    }

    // 3) Fetch participants
    const participantRows = await ChatRoomParticipant.findAll({
      where: { chat_room_id: roomId }
    });
    const participantIds = participantRows.map((row) => row.user_id);

    // 4) Return the room details plus participant IDs
    return res.status(200).json({
      room: {
        id: room.id,
        isGroup: !!room.is_group,
        title: room.room_name,
        createdAt: room.created_at
      },
      participants: participantIds
    });
  } catch (error) {
    console.error('Error getting room info:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
