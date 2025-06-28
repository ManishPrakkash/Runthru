const express = require('express');
const router = express.Router();
const historyController = require('../controllers/historyController');
const authMiddleware = require('../middleware/authMiddleware');

// @route   GET /api/history
// @desc    Get all history entries for the authenticated user
// @access  Private
router.get('/', authMiddleware, historyController.getHistory);

module.exports = router;