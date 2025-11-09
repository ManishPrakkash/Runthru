// Ensure env from root and server .env files are loaded (no override of existing)
try {
  const dotenv = require('dotenv');
  const path = require('path');
  dotenv.config({ path: path.resolve(__dirname, '../.env'), override: false });
  dotenv.config({ path: path.resolve(__dirname, '.env'), override: false });
} catch (e) {}
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // No token provided — return 401 without noisy logging (keeps logs cleaner during tests)
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ FIX: Set req.user to decoded.user
    req.user = decoded.user;

    console.log('✅ Authenticated user:', req.user);
    next();
  } catch (err) {
    console.error('❌ Invalid token:', err.message);
    return res.status(401).json({ message: 'Login to continue...' });
  }
};
