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

// Helper: sanitize username for logs
function safeUsername(u) {
  if (!u) return '<empty>'; return String(u).replace(/\s+/g, ' ').slice(0,60);
}

// Dev-only flag
const IS_DEV = process.env.NODE_ENV !== 'production';

// User registration
exports.register = async (req, res) => {
  const { username, password } = req.body;
  if (IS_DEV) {
    console.log(`➡️  [REGISTER] Incoming request username='${safeUsername(username)}'`);
  }

  try {
    // Validate input
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // Check if user already exists
    let user = await User.findOne({ username });
    if (user) {
      if (IS_DEV) console.log(`⚠️  [REGISTER] Username '${safeUsername(username)}' already exists`);
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
  console.log('✅ [REGISTER] User registered successfully:', safeUsername(username));

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
          console.error('❌ [REGISTER] JWT Generation Error:', err);
          return res.status(500).json({ message: 'Token generation failed', error: err.message });
        }
        if (IS_DEV) console.log(`🎫 [REGISTER] JWT issued for '${safeUsername(username)}' exp=1h`);
        res.status(201).json({ message: 'User registered successfully', token, username: user.username });
      }
    );

  } catch (err) {
    console.error('❌ [REGISTER] Error:', err);
    res.status(500).json({ message: 'Server error during registration', error: err.message });
  }
};

// User login
exports.login = async (req, res) => {
  const { username, password } = req.body;
  if (IS_DEV) {
    console.log(`➡️  [LOGIN] Incoming request username='${safeUsername(username)}'`);
  }

  try {
    // Validate input
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // Check if user exists
    let user = await User.findOne({ username });
    if (!user) {
      if (IS_DEV) console.log(`❌ [LOGIN] Username '${safeUsername(username)}' not found`);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      if (IS_DEV) console.log(`❌ [LOGIN] Password mismatch for '${safeUsername(username)}'`);
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    console.log('✅ [LOGIN] User logged in successfully:', safeUsername(username));

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
          console.error('❌ [LOGIN] JWT Generation Error:', err);
          return res.status(500).json({ message: 'Token generation failed', error: err.message });
        }
        if (IS_DEV) console.log(`🎫 [LOGIN] JWT issued for '${safeUsername(username)}' exp=1h`);
        res.json({ message: 'Logged in successfully', token, username: user.username });
      }
    );

  } catch (err) {
    console.error('❌ [LOGIN] Error:', err);
    res.status(500).json({ message: 'Server error during login', error: err.message });
  }
};

// Dev-only: list users (excluding passwords)
exports.listUsers = async (req, res) => {
  if (!IS_DEV) return res.status(403).json({ message: 'Forbidden in production' });
  try {
    const users = await User.find({}, { username: 1, createdAt: 1 }).sort({ createdAt: -1 });
    res.json({ count: users.length, users });
  } catch (err) {
    console.error('❌ [USERS] Error listing users:', err);
    res.status(500).json({ message: 'Server error listing users', error: err.message });
  }
};
