'use strict';

/**
 * modules/Chat/models/message.js
 */
module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    chat_room_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    sender_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    tableName: 'Messages',
    timestamps: true,
    underscored: true
  });

  Message.associate = function(models) {
    // link to ChatRoom
    Message.belongsTo(models.ChatRoom, {
      foreignKey: 'chat_room_id',
      as: 'chatRoom'
    });
    // if desired, link to User model
    // Message.belongsTo(models.User, { foreignKey: 'sender_id' });
  };

  return Message;
};
