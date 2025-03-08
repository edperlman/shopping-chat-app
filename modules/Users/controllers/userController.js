/**
 * modules/Users/controllers/userController.js
 *
 * Contains user endpoints for signup, register, login, profile, etc.
 */

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Influencer } = require('../../../src/models');

// 1) signupUser - POST /users/signup
const signupUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields (name, email, password)' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password_hash: hashedPassword,
      role: role || 'regular_user'
    });

    return res.status(201).json({
      message: 'User created via /signup successfully',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error('Error signing up user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// 2) registerUser - POST /users/register
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password_hash: hashedPassword
      // role defaults to 'regular_user' if not specified
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error registering user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// 3) loginUser - POST /users/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // 3a) Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // 3b) Compare password
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // 3c) Sign JWT
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is undefined. Check your .env file.');
      return res.status(500).json({ message: 'Internal server error (missing JWT secret)' });
    }

    const tokenPayload = { id: user.id, role: user.role };
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });

    // 3d) Return success
    return res.status(200).json({
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

// 4) GET /users/profile
const getUserProfile = async (req, res) => {
  try {
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
        createdAt: user.created_at,
        updatedAt: user.updated_at
      }
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// 5) PATCH /users/profile
const updateUserProfile = async (req, res) => {
  try {
    // ...
  } catch (error) {
    console.error('Error updating user profile:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// 6) GET /users/:id
const getUserById = async (req, res) => {
  try {
    // ...
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  signupUser,
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getUserById
};
