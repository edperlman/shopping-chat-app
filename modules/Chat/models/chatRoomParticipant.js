'use strict';

/**
 * modules/Chat/models/chatRoomParticipant.js
 */
module.exports = (sequelize, DataTypes) => {
  const ChatRoomParticipant = sequelize.define('ChatRoomParticipant', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    chat_room_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    role: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'ChatRoomParticipants',
    timestamps: true,
    underscored: true
  });

  ChatRoomParticipant.associate = function(models) {
    ChatRoomParticipant.belongsTo(models.ChatRoom, {
      foreignKey: 'chat_room_id',
      as: 'chatRoom'
    });
    // If your "Users" table references the same ID used here:
    // ChatRoomParticipant.belongsTo(models.User, { foreignKey: 'user_id' });
  };

  return ChatRoomParticipant;
};
