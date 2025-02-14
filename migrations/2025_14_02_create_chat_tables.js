'use strict';

/**
 * Sequelize migration that creates "ChatRooms", "ChatRoomParticipants", "Messages"
 * with uppercase table names and foreign keys referencing "Users" and "ChatRooms".
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1) Create "ChatRooms"
    await queryInterface.createTable('ChatRooms', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      room_name: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      }
    });

    // 2) Create "ChatRoomParticipants"
    await queryInterface.createTable('ChatRoomParticipants', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      chat_room_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      role: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      }
    });

    // Add foreign keys to "ChatRoomParticipants"
    // referencing "ChatRooms" and "Users" (assuming "Users" table is uppercase as well)
    await queryInterface.addConstraint('ChatRoomParticipants', {
      fields: ['chat_room_id'],
      type: 'foreign key',
      name: 'fk_chatroom_id_participants', // unique constraint name
      references: {
        table: 'ChatRooms',
        field: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
    await queryInterface.addConstraint('ChatRoomParticipants', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'fk_user_id_participants',
      references: {
        table: 'Users', // your main "Users" table
        field: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });

    // 3) Create "Messages"
    await queryInterface.createTable('Messages', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      chat_room_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      sender_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      }
    });

    // Add foreign keys for "Messages"
    await queryInterface.addConstraint('Messages', {
      fields: ['chat_room_id'],
      type: 'foreign key',
      name: 'fk_chatroom_id_msgs',
      references: {
        table: 'ChatRooms',
        field: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
    await queryInterface.addConstraint('Messages', {
      fields: ['sender_id'],
      type: 'foreign key',
      name: 'fk_sender_id_msgs',
      references: {
        table: 'Users',
        field: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {
    // revert in reverse order
    await queryInterface.dropTable('Messages');
    await queryInterface.dropTable('ChatRoomParticipants');
    await queryInterface.dropTable('ChatRooms');
  }
};
