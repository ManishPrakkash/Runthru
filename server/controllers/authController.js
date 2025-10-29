// Ensure env from root and server .env files are loaded (no override of existing)
try {
  const dotenv = require('dotenv');
  const path = require('path');
  dotenv.config({ path: path.resolve(__dirname, '../.env'), override: false });
  dotenv.config({ path: path.resolve(__dirname, '.env'), override: false });
} catch (e) {}
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// User registration
exports.register = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Validate input
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // Check if user already exists
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    user = new User({
      username,
      password: hashedPassword
    });

    await user.save();
    console.log('✅ User registered successfully:', username);

    // Generate JWT
    const payload = {
      user: {
        id: user.id,
        username: user.username
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' }, // Token expires in 1 hour
      (err, token) => {
        if (err) {
          console.error('❌ JWT Generation Error:', err);
          return res.status(500).json({ message: 'Token generation failed', error: err.message });
        }
        res.status(201).json({ message: 'User registered successfully', token, username: user.username });
      }
    );

  } catch (err) {
    console.error('❌ Registration Error:', err);
    res.status(500).json({ message: 'Server error during registration', error: err.message });
  }
};

// User login
exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Validate input
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // Check if user exists
    let user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log('✅ User logged in successfully:', username);

    // Generate JWT
    const payload = {
      user: {
        id: user.id,
        username: user.username
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' }, // Token expires in 1 hour
      (err, token) => {
        if (err) {
          console.error('❌ JWT Generation Error:', err);
          return res.status(500).json({ message: 'Token generation failed', error: err.message });
        }
        res.json({ message: 'Logged in successfully', token, username: user.username });
      }
    );

  } catch (err) {
    console.error('❌ Login Error:', err);
    res.status(500).json({ message: 'Server error during login', error: err.message });
  }
};
