const History = require('../models/History');

// Get user's history
exports.getHistory = async (req, res) => {
  const userId = req.user.id; // From auth middleware

  try {
    const history = await History.find({ userId }).sort({ createdAt: -1 }); // Sort by newest first
    res.json(history);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error fetching history');
  }
};

// Potentially add more history operations like get by ID, delete, etc.
// exports.getHistoryById = async (req, res) => { ... };
// exports.deleteHistoryItem = async (req, res) => { ... };
