/**
 * modules/Influencer/models/influencer.js
 *
 * Defines the "Influencers" table. 
 * user_id is primaryKey (if that's your real schema) or we can do id as PK. 
 */
module.exports = (sequelize, DataTypes) => {
    const Influencer = sequelize.define('Influencer', {
      user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true // if each user_id is unique in this table
      },
      influencer_status: {
        type: DataTypes.STRING(50)
      },
      verification_requested_at: {
        type: DataTypes.DATE
      },
      verification_approved_at: {
        type: DataTypes.DATE
      },
      social_media_handle: {
        type: DataTypes.STRING(255)
      },
      bio: {
        type: DataTypes.TEXT
      },
      followers_count: {
        type: DataTypes.INTEGER
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    }, {
      tableName: 'Influencers', // matches your DB table
      underscored: true,
      timestamps: false // or true if you want Sequelize to manage createdAt, updatedAt
    });
  
    // Optional: define associations
    Influencer.associate = (models) => {
      // If you want to link Influencer to User:
      Influencer.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });
    };
  
    return Influencer;
  };
  