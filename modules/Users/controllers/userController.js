/**
 * modules/Users/controllers/userController.js
 *
 * Contains core user endpoints: registration, login, user profile management,
 * plus a new endpoint to update user profile fields (location, DoB, preferences).
 */

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// IMPORTANT: Import the actual Sequelize model instance from src/models
const { User, Influencer } = require('../../../src/models'); 
// ^ Now we also import Influencer, so we can store influencerBio, socialMedia, etc.

// POST /users/register
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with default role = 'regular_user'
    const user = await User.create({
      name,
      email,
      password_hash: hashedPassword
      // role, location, date_of_birth, preferences might have defaults in the model
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role // default 'regular_user' unless specified
      }
    });
  } catch (error) {
    console.error('Error registering user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// POST /users/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find the user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare the password to the hash
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Create a payload for JWT
    const tokenPayload = {
      id: user.id,
      role: user.role
    };

    // Sign the JWT
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });

    // Return token + user data
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error logging in user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// GET /users/profile
const getUserProfile = async (req, res) => {
  try {
    // `req.user` is set by the authenticate middleware
    const userId = req.user.id;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        location: user.location,
        date_of_birth: user.date_of_birth,
        preferences: user.preferences,
        createdAt: user.created_at, // or user.createdAt if you use timestamps
        updatedAt: user.updated_at  // or user.updatedAt
      }
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// PATCH /users/profile
// Allows updating location, date_of_birth, preferences, etc.
// Also merges influencer fields if role='influencer'
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { location, date_of_birth, preferences, influencerBio, socialMedia } = req.body;

    // 1) Fetch user
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 2) Update basic user fields
    if (location !== undefined) user.location = location;
    if (date_of_birth !== undefined) user.date_of_birth = date_of_birth;
    if (preferences !== undefined) {
      // Optionally store as JSON if your DB schema supports it
      user.preferences = preferences;
    }
    await user.save();

    // 3) If user is influencer, update or create row in "Influencers" table
    let influencerRow = null;
    if (user.role === 'influencer') {
      influencerRow = await Influencer.findOne({ where: { user_id: userId } });
      if (!influencerRow) {
        // create new influencer row
        influencerRow = await Influencer.create({
          user_id: userId,
          influencer_status: 'verified', // or 'pending', depends on your logic
          bio: influencerBio || null,
          social_media_handle: socialMedia ? JSON.stringify(socialMedia) : null
        });
      } else {
        // update existing row
        if (influencerBio !== undefined) {
          influencerRow.bio = influencerBio;
        }
        if (socialMedia !== undefined) {
          influencerRow.social_media_handle = JSON.stringify(socialMedia);
        }
        await influencerRow.save();
      }
    }

    // 4) Build response object
    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      location: user.location,
      date_of_birth: user.date_of_birth,
      preferences: user.preferences,
      createdAt: user.created_at,
      updatedAt: user.updated_at
    };

    if (influencerRow) {
      userResponse.influencerBio = influencerRow.bio;
      userResponse.socialMedia = influencerRow.social_media_handle
        ? JSON.parse(influencerRow.social_media_handle)
        : null;
    }

    return res.status(200).json({
      message: 'User profile updated',
      user: userResponse
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// GET /users/:id
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return some or all user fields
    res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        location: user.location,
        date_of_birth: user.date_of_birth,
        preferences: user.preferences,
        createdAt: user.created_at,
        updatedAt: user.updated_at
      }
    });
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getUserById
};
