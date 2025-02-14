'use strict';

/**
 * modules/Chat/models/chatRoom.js
 */
module.exports = (sequelize, DataTypes) => {
  const ChatRoom = sequelize.define('ChatRoom', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    room_name: {
      type: DataTypes.STRING,
      allowNull: true
    }
    // plus timestamps from underscored
  }, {
    tableName: 'ChatRooms',
    timestamps: true,
    underscored: true
  });

  ChatRoom.associate = function(models) {
    // If using many-to-many approach with ChatRoomParticipants
    ChatRoom.hasMany(models.ChatRoomParticipant, {
      foreignKey: 'chat_room_id',
      as: 'participants'
    });
    ChatRoom.hasMany(models.Message, {
      foreignKey: 'chat_room_id',
      as: 'messages'
    });
  };

  return ChatRoom;
};
